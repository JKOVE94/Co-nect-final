package conect.service.board.proj;

import conect.data.dto.DepartmentDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.form.ProjectForm;

import java.util.List;
import java.util.Map;

public interface ProjService {
	List<TaskDto> getAllTask(int task_fk_proj_num);

	List<TaskDto> getAllTaskWithUser(int user_pk_num);

	// 로그인한 사용자가 참여하고 있는 프로젝트 반환 - Calendar
	List<ProjectDto> getScheduleAll(int usernum);

	List<ProjectDto> getListAll();

	ProjectDto getProjById(int projPkNum);
	
	// 모든 부서목록 반환
	List<DepartmentDto> getAllDepartments();
	
	// 프로젝트 생성
	int addProject(ProjectForm form);

	// 프로젝트 수정
	void editProject(int projPkNum, ProjectForm form);

	Map<String, Object> getUserRelatedData(int userPkNum);
}
