package conect.service.board.proj;

import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.dto.TodoDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.ProjectmemberEntity;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ProjectmemberRepository;
import conect.data.repository.TaskRepository;
import conect.data.repository.TodoRepository;
import conect.data.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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
	private ProjectmemberRepository projectmemberRepository;

	@Autowired
	private CompanyRepository compRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private TodoRepository todoRepository;

	@Override
	public List<ProjectDto> getAllProjects() {
		List<ProjectEntity> entities = prepository.findAll();
		return entities.stream().map(ProjectDto::fromEntity).collect(Collectors.toList());
	}

	public List<ProjectDto> getListAll() {
		return prepository.findAll().stream().map(ProjectDto::fromEntity).toList();
	}

	@Override
	public ProjectDto getProjById(int projPkNum) {
		System.out.println("getProjById : " + projPkNum);
		return prepository.findById(projPkNum)
				.map(ProjectDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("getProjById 프로젝트가 존재하지 않습니다."));
	}

	// 프로젝트 생성 메서드
	@Override
	@Transactional
	public int addProject(ProjectForm form) {
		// DTO (ProjectForm) -> Entity (ProjectEntity)
		ProjectEntity entity = ProjectForm.toEntity(form);


		// 부서, 담당자, 회사 설정
		UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
				.orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
		CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
				.orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

		entity.setCompanyEntity(compEntity);

		// Entity 저장 후, 저장된 엔티티 반환
		ProjectEntity savedEntity = prepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getProjPkNum();
	}

	public void editProject(int projPkNum, ProjectForm form) {
		// 프로젝트 번호로 기존 프로젝트 조회
		ProjectEntity entity = prepository.findById(form.getProj_pk_num())
				.orElseThrow(() -> new RuntimeException("editProject 프로젝트가 존재하지 않습니다."));

		// 기존 proj_created 값은 그대로 유지하고, 나머지 필드를 수정
		ProjectEntity updatedEntity = ProjectForm.toEntity(form);



		entity.setProjStartdate(updatedEntity.getProjStartdate());
		entity.setProjEnddate(updatedEntity.getProjEnddate());

		entity.setProjStatus(updatedEntity.getProjStatus());

		entity.setProjUpdated(LocalDate.now()); // 프로젝트 수정 날짜 설정

		// 부서, 담당자, 회사 설정
		UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
				.orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
		CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
				.orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

		entity.setCompanyEntity(compEntity);

		prepository.save(entity); // 수정된 Entity 저장
	}

	@Override
	public List<TaskDto> getAllTask(int task_fk_proj_num) {
		return taskRepository.getTaskByTaskFkProjNum(task_fk_proj_num).stream()
				.map(TaskDto::fromEntity)
				.collect(Collectors.toList());
	}

	@Override
	public List<TaskDto> getAllTaskWithUser(int user_pk_num) {
		return taskRepository.getTaskByTaskFkUserNum(user_pk_num).stream()
				.map(TaskDto::fromEntity)
				.collect(Collectors.toList());
	}

	@Override
	public List<ProjectDto> getScheduleAll(int usernum) {
		String pattern = "(?<=,|^)" + usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern)
				.stream().map(ProjectDto::fromEntity).toList();
	}

	@Override
	public Map<String, Object> getUserRelatedData(int userPkNum) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("tasks", taskRepository.getTaskByTaskFkUserNum(userPkNum).stream()
				.map(TaskDto::fromEntity)
				.collect(Collectors.toList()));
		// result.put("projects", prepository.getProjByTaskFkUserNum(userPkNum).stream()
		// .map(ProjectDto::fromEntity)
		// .collect(Collectors.toList()));
		result.put("posts", postRepository.getPostByTaskFkUserNum(userPkNum).stream()
				.map(PostDto::fromEntity)
				.collect(Collectors.toList()));
		result.put("todos", todoRepository.getTodoByTaskFkUserNum(userPkNum).stream()
				.map(TodoDto::fromEntity)
				.collect(Collectors.toList()));
		return result;
	}

	public List<ProjectDto> getUserProjectData(int userPkNum) {

		return prepository.getProjByTaskFkUserNum(userPkNum).stream()
				.map(ProjectDto::fromEntity)
				.collect(Collectors.toList());
	}

	@Override
	public List<ProjectDto> getAllProjInfo(int compNum) {
		// TODO 프로젝트 목록 가져오기
		// return prepository.findByProjCompNum(compNum)
		// .stream().map(ProjectDto::fromEntity).toList();

		return prepository.findByProjCompNum(compNum)
				.stream().map(ProjectDto::fromEntity).toList();
	}

	/*
	 * //검색용 status list 출력
	 * 
	 * @Override
	 * public Set<String> getStatusAll(int compNum) {
	 * List<ProjectDto> list =
	 * prepository.findByProjCompNum(compNum).stream().map(ProjectDto::fromEntity).
	 * toList();
	 * Set<String> statusList = new HashSet<String>();
	 * for(ProjectDto dto : list) {
	 * String status = dto.getProj_status();
	 * if(!status.isEmpty()) {
	 * statusList.add(status);
	 * }
	 * }
	 * return statusList;
	 * }
	 * /*
	 * //검색
	 * 
	 * @Override
	 * public List<ProjectDto> getSearchData(String status, String title) {
	 * 
	 * return prepository.findByProjStatusContainsAndProjNameContains(status, title)
	 * .stream().map(ProjectDto::fromEntity).toList();
	 * >>>>>>> origin/ksh-Refactoring
	 * }
	 */
}
