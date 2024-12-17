package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.form.ProjectForm;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface ProjService {
	List<TaskDto> getAllTask(int task_fk_proj_num);

	List<TaskDto> getAllTaskWithUser(int user_pk_num);

	// 로그인한 사용자가 참여하고 있는 프로젝트 반환 - Calendar
	List<ProjectDto> getScheduleAll(int usernum);
	
	// 검색
	//Set<String> getStatusAll(int compNum);
	//List<ProjectDto> getSearchData(String status, String title);

	List<ProjectDto> getListAll(int compPkNum);

	// 상세보기
	ProjectDto getProjById(int compPkNum, int projPkNum);
	
	List<ProjectDto> getAllProjects(int compPkNum);
	
	// 페이징
	//public Page<ProjectDto> getList(int page, int pageSize);

	// 프로젝트 생성
	int addProject(int compPkNum, ProjectForm form);

	// 프로젝트 수정
	void editProject(int projPkNum,int comPkNum, ProjectForm form);

	//Map<String, Object> getUserRelatedData(int userPkNum);

	// 회사코드 관련 프로젝트 읽어오기
	//List<ProjectDto> getAllProjInfo(int compNum);
}
