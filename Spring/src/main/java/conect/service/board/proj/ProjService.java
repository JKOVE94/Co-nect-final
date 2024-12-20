package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.form.ProjectForm;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;



public interface ProjService {
	List<TaskDto> getAllTask(int task_fk_proj_num);

	List<TaskDto> getAllTaskWithUser(int user_pk_num);
	
	// 검색
	//Set<String> getStatusAll(int compNum);
//	List<ProjectDto> getSearchData(String status, String title);

	List<ProjectDto> getListAll();

	ProjectDto getProjById(int projPkNum);
	
	List<ProjectDto> getAllProjects();
	
	List<ProjectDto> getUserProjectData(int userPkNum);
	
	// 페이징
	//public Page<ProjectDto> getList(int page, int pageSize);

	// 프로젝트 생성
	int addProject(ProjectForm form);

	// 프로젝트 수정
	void editProject(int projPkNum, ProjectForm form);

	Map<String, Object> getUserRelatedData(int userPkNum);

	// 회사코드 관련 프로젝트 읽어오기
	List<ProjectDto> getAllProjInfo(int compNum);
}
