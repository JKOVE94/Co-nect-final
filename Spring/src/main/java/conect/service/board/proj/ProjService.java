package conect.service.board.proj;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

import conect.data.dto.ProjectDto;

public interface ProjService {
	
	//프로젝트 전체 읽어오기_ArrayList
	public ArrayList<ProjectDto> getAllProjInfoList();
	
	
	//프로젝트 전체 읽어오기_HashMap
	public HashMap<Integer, ProjectDto> getAllProjInfo();
	
	
	//proj_pk_num을 사용해서 특정 데이터만 return
	public Optional<ProjectDto> getOneProjectInfo(int proj_pk_num);
	
	
}
