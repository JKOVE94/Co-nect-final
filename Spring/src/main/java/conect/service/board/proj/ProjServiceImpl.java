package conect.service.board.proj;

import conect.data.dto.DepartmentDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.DepartmentEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.DepartmentRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import conect.data.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjServiceImpl implements ProjService {

	@Autowired
	private ProjectRepository prepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DepartmentRepository deptRepository;

	@Autowired
	private CompanyRepository compRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private PostRepository postRepository;

	public List<ProjectDto> getScheduleAll(int usernum) {
		String pattern = "(?<=,|^)" + usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern).stream().map(ProjectDto::fromEntity).toList();
	}

	// 전체 자료 읽기
		public List<ProjectDto> getListAll() {
		    return prepository.findAll().stream()
		            .map(ProjectDto::fromEntity)  // Entity에서 DTO로 변환
		            .collect(Collectors.toList());
		}

	public ProjectDto getProjById(int projPkNum) {
		return prepository.findByIdWithUser(projPkNum).map(ProjectDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다. ID: " + projPkNum));
	}
	
	// 모든 부서를 DTO로 반환 (셀렉트 박스용)
    public List<DepartmentDto> getAllDepartments() {
        return deptRepository.findAll().stream()
                .map(DepartmentDto::fromEntity)  // DepartmentEntity를 DepartmentDto로 변환
                .collect(Collectors.toList());
    }

	// 프로젝트 생성 메서드
	@Transactional
	public int addProject(ProjectForm form) {
		// DTO (ProjectForm) -> Entity (ProjectEntity)
		ProjectEntity entity = ProjectForm.toEntity(form);

		// proj_created가 null인 경우 현재 날짜로 설정
		if (entity.getProjCreated() == null) {
			entity.setProjCreated(new Date());
		}

		// 부서, 담당자, 회사 설정
		DepartmentEntity deptEntity = deptRepository.findById(form.getProj_fk_dpart_num())
				.orElseThrow(() -> new RuntimeException("부서가 존재하지 않습니다."));
		UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
				.orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
		CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
				.orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

		entity.setDepartmentEntity(deptEntity);
		entity.setUserEntity(userEntity);
		entity.setCompanyEntity(compEntity);

		// Entity 저장 후, 저장된 엔티티 반환
		ProjectEntity savedEntity = prepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getProjPkNum();
	}

	public void editProject(int projPkNum, ProjectForm form) {
		// 프로젝트 번호로 기존 프로젝트 조회
		ProjectEntity entity = prepository.findById(form.getProj_pk_num())
				.orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

		// 기존 proj_created 값은 그대로 유지하고, 나머지 필드를 수정
		ProjectEntity updatedEntity = ProjectForm.toEntity(form);
		updatedEntity.setProjCreated(entity.getProjCreated()); // 기존 생성일을 유지

		entity.setProjName(updatedEntity.getProjName());
		entity.setProjMembers(updatedEntity.getProjMembers());
		entity.setProjStartdate(updatedEntity.getProjStartdate());
		entity.setProjEnddate(updatedEntity.getProjEnddate());
		entity.setProjImport(updatedEntity.getProjImport());
		entity.setProjStatus(updatedEntity.getProjStatus());
		entity.setProjDesc(updatedEntity.getProjDesc());
		entity.setProjUpdated(new Date()); // 프로젝트 수정 날짜 설정

		// 부서, 담당자, 회사 설정
		DepartmentEntity deptEntity = deptRepository.findById(form.getProj_fk_dpart_num())
				.orElseThrow(() -> new RuntimeException("부서가 존재하지 않습니다."));
		UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
				.orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
		CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
				.orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

		entity.setDepartmentEntity(deptEntity);
		entity.setUserEntity(userEntity);
		entity.setCompanyEntity(compEntity);

		prepository.save(entity); // 수정된 Entity 저장
	}

	@Override
	public List<TaskDto> getAllTask(int task_fk_proj_num) {
		return taskRepository.getTaskByTaskFkProjNum(task_fk_proj_num).stream().map(TaskDto::fromEntity)
				.collect(Collectors.toList());
	}

	@Override
	public List<TaskDto> getAllTaskWithUser(int user_pk_num) {
		return taskRepository.getTaskByTaskFkUserNum(user_pk_num).stream().map(TaskDto::fromEntity)
				.collect(Collectors.toList());
	}

	public Map<String, Object> getUserRelatedData(int userPkNum) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("tasks", taskRepository.getTaskByTaskFkUserNum(userPkNum).stream().map(TaskDto::fromEntity)
				.collect(Collectors.toList()));
		result.put("projects", prepository.getProjByTaskFkUserNum(userPkNum).stream().map(ProjectDto::fromEntity)
				.collect(Collectors.toList()));
		result.put("posts", postRepository.getPostByTaskFkUserNum(userPkNum).stream().map(PostDto::fromEntity)
				.collect(Collectors.toList()));
		return result;
	}
}
