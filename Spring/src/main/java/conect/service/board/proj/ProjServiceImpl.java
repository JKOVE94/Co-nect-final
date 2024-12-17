package conect.service.board.proj;

import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import conect.data.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjServiceImpl implements ProjService {

	@Autowired
	private ProjectRepository prepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CompanyRepository compRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private PostRepository postRepository;

	@Override
	public List<ProjectDto> getAllProjects(int compPkNum) {
		List<ProjectEntity> entities = prepository.findByCompanyEntity_CompPkNum(compPkNum);
		return entities.stream().map(ProjectDto::fromEntity).collect(Collectors.toList());
	}

	/*
	 * // 페이징, 정렬
	 * public Page<ProjectDto> getList(int page, int pageSize) {
	 * // 정렬 정보 생성
	 * 
	 * // Pageable 객체 생성 (페이지와 정렬 정보 포함)
	 * Pageable pageable = PageRequest.of(page, pageSize);
	 * 
	 * // Repository를 통해 데이터를 조회
	 * Page<ProjectEntity> postPage = this.prepository.findAll(pageable);
	 * // ProjectEntity -> dto 변환
	 * return postPage.map(ProjectDto::fromEntity);
	 * }
	 */
	public List<ProjectDto> getScheduleAll(int usernum) {
		String pattern = "(?<=,|^)" + usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern)
				.stream().map(ProjectDto::fromEntity).toList();
	}

	public List<ProjectDto> getListAll(int compPkNum) {
		return prepository.findByCompanyEntity_CompPkNum(compPkNum)
				.stream()
				.map(ProjectDto::fromEntity)
				.toList();
	}

	// 상세보기
	public ProjectDto getProjById(int compPkNum, int projPkNum) {
		return prepository.findByProjPkNumAndCompanyEntity_CompPkNum(projPkNum, compPkNum)
	            .map(ProjectDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다. ID: " + projPkNum));
	}

	// 프로젝트 생성 메서드
	@Transactional
	public int addProject(int compPkNum, ProjectForm form) {
		//회사 설정
		CompanyEntity compEntity = compRepository.findById(compPkNum)
				.orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

		// DTO (ProjectForm) -> Entity (ProjectEntity)
		ProjectEntity entity = ProjectForm.toEntity(form);
		
		entity.setCompanyEntity(compEntity);

		// Entity 저장 후, 저장된 엔티티 반환
		ProjectEntity savedEntity = prepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getProjPkNum();
	}

	// 수정 메서드
	public void editProject(int projPkNum,int comPkNum, ProjectForm form) {
		// 프로젝트 번호로 기존 프로젝트 조회
		ProjectEntity entity = prepository.findById(form.getProj_pk_num())
				.orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

		// 기존 proj_created 값은 그대로 유지하고, 나머지 필드를 수정
		ProjectEntity updatedEntity = ProjectForm.toEntity(form);

		entity.setProjTitle(updatedEntity.getProjTitle());
		entity.setProjContent(updatedEntity.getProjContent());
		entity.setProjStartdate(updatedEntity.getProjStartdate());
		entity.setProjEnddate(updatedEntity.getProjEnddate());
		entity.setProjStatus(updatedEntity.getProjStatus());
		entity.setProjUpdated(updatedEntity.getProjUpdated()); // 프로젝트 수정 날짜 설정

		// 부서, 담당자, 회사 설정
		CompanyEntity compEntity = compRepository.findById(comPkNum)
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
/*
	@Override
	public Map<String, Object> getUserRelatedData(int userPkNum) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("tasks", taskRepository.getTaskByTaskFkUserNum(userPkNum).stream()
				.map(TaskDto::fromEntity)
				.collect(Collectors.toList()));
		result.put("projects", prepository.getProjByTaskFkUserNum(userPkNum).stream()
				.map(ProjectDto::fromEntity)
				.collect(Collectors.toList()));
		result.put("posts", postRepository.getPostByTaskFkUserNum(userPkNum).stream()
				.map(PostDto::fromEntity)
				.collect(Collectors.toList()));
		return result;
	}

	@Override
	public List<ProjectDto> getAllProjInfo(int compNum) {
		// TODO 프로젝트 목록 가져오기
		return prepository.findByProjCompNum(compNum)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	
	//검색용 status list 출력
	@Override
	public Set<String> getStatusAll(int compNum) {
		List<ProjectDto> list = 
				prepository.findByProjCompNum(compNum).stream().map(ProjectDto::fromEntity).toList();
		Set<String> statusList = new HashSet<String>();
		for(ProjectDto dto : list) {
			String status = dto.getProj_status();
			if(!status.isEmpty()) {
				statusList.add(status);
			}
		}
		return statusList;
	}

	//검색
	@Override
	public List<ProjectDto> getSearchData(int compNum, String status, String title) {
		
		return prepository.findByProjStatusContainsAndProjTitleContains(compNum, status, title)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	*/

}
