package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;

import java.util.List;
import java.util.Map;

public interface ProjService {
    List <TaskDto> getAllTask(int task_fk_proj_num);
    List <TaskDto> getAllTaskWithUser(int user_pk_num);
    
	//로그인한 사용자가 참여하고 있는 프로젝트 반환 - Calendar
	List<ProjectDto> getScheduleAll(int usernum);
	
	List<ProjectDto> getListAll();
	
	ProjectDto getProjById(int projPkNum);
	
	Map<String, Object> getUserRelatedData(int userPkNum);
	
	//회사코드 관련 프로젝트 읽어오기
	List<ProjectDto> getAllProjInfo(int compNum);
}
