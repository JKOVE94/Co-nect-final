package conect.service.board.proj;

import java.util.List;

import conect.data.dto.ProjectDto;
import conect.data.form.ProjectForm;

public interface ProjService {
	//로그인한 사용자가 참여하고 있는 프로젝트 반환 - Calendar
	List<ProjectDto> getScheduleAll(int usernum);
	
	List<ProjectDto> getListAll();
	
	ProjectDto getProjById(int projPkNum);
	
	//프로젝트 생성
	int addProject(ProjectForm form);
	
	//프로젝트 수정
	void editProject(int projPkNum, ProjectForm form);
}
