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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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

	public List<ProjectDto> getListAll() {
		return prepository.findAll().stream().map(ProjectDto::fromEntity).toList();
	}

	public ProjectDto getProjById(int projPkNum) {
		return prepository.findByIdWithUser(projPkNum)
				.map(ProjectDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다. ID: " + projPkNum));
	}


	
	// 프로젝트 생성 메서드
	@Override
	@Transactional
	public int addProject(ProjectForm form) {
	    // DTO (ProjectForm) -> Entity (ProjectEntity)
	    ProjectEntity entity = ProjectForm.toEntity(form);

	    // proj_created가 null인 경우 현재 날짜로 설정
	    if (entity.getProjStartdate() == null) {
	        entity.setProjStartdate(LocalDate.now());
	    }

	    // 회사 설정
	    CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
	            .orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));
	    entity.setCompanyEntity(compEntity);

	    // Entity 저장
	    ProjectEntity savedEntity = prepository.save(entity);

	    // ProjectmemberEntity 생성 및 저장
	    UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
	            .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
	    
	    ProjectmemberEntity projectMember = new ProjectmemberEntity();
	    projectMember.setProjectEntity(savedEntity);
	    projectMember.setUserEntity(userEntity);
	    projectmemberRepository.save(projectMember);

	    // 저장된 엔티티의 Primary Key 반환
	    return savedEntity.getProjPkNum();
	}



	@Transactional
	public void editProject(int projPkNum, ProjectForm form) {
	    // 프로젝트 번호로 기존 프로젝트 조회
	    ProjectEntity entity = prepository.findById(projPkNum)
	            .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

	    // 기존 필드 업데이트
	    entity.setProjTitle(form.getProj_title());
	    entity.setProjStartdate(form.getProj_startdate());
	    entity.setProjEnddate(form.getProj_enddate());
	    entity.setProjStatus(form.getProj_status());
	    entity.setProjContent(form.getProj_content());
	    entity.setProjUpdated(LocalDate.now());

	    // 회사 설정
	    CompanyEntity compEntity = compRepository.findById(form.getProj_fk_comp_num())
	            .orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));
	    entity.setCompanyEntity(compEntity);

	    // 프로젝트 멤버 업데이트
	    UserEntity userEntity = userRepository.findById(form.getProj_fk_user_num())
	            .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
	    
	    // 기존 프로젝트 멤버 찾기 또는 새로 생성
	    ProjectmemberEntity projectMember = projectmemberRepository.findByProjectEntity(entity)
	            .orElse(new ProjectmemberEntity());
	    
	    projectMember.setProjectEntity(entity);
	    projectMember.setUserEntity(userEntity);
	    projectmemberRepository.save(projectMember);

	    // 수정된 Entity 저장
	    prepository.save(entity);
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
		result.put("todos", todoRepository.getTodoByTaskFkUserNum(userPkNum).stream()
				.map(TodoDto::fromEntity)
				.collect(Collectors.toList()));
		return result;
	}
	
	public List<ProjectDto> getUserProjectData(int userPkNum){
		
		return prepository.getProjByTaskFkUserNum(userPkNum).stream()
				.map(ProjectDto::fromEntity)
				.collect(Collectors.toList());
	}
	

	@Override
	public List<ProjectDto> getAllProjInfo(int compNum) {
		// TODO 프로젝트 목록 가져오기
		return prepository.findByProjCompNum(compNum)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	
	/*
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
	/*
	//검색
	@Override
	public List<ProjectDto> getSearchData(String status, String title) {
		
		return prepository.findByProjStatusContainsAndProjNameContains(status, title)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	*/
}
