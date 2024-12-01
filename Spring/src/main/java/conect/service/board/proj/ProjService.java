package conect.service.board.proj;

import java.util.ArrayList;
import java.util.List;

import conect.data.dto.ProjectDto;

public interface ProjService {
	//로그인한 사용자가 참여하고 있는 프로젝트 반환 - Calendar
	List<ProjectDto> getScheduleAll(int usernum);
	
	List<ProjectDto> getListAll();
	
	ProjectDto getProjById(int projPkNum);
	
	//회사코드 관련 프로젝트 읽어오기
	List<ProjectDto> getAllProjInfo(int compNum);
	
}
