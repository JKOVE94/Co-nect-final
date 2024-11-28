package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
import conect.data.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;

	@Override
	public ArrayList<ProjectDto> getAllProjInfoList() {
		// TODO ArrayList로 Project 전체 정보 반환
		List<ProjectEntity> prjList = prepository.findAll();
		//dto 로 타입 변환
		List<ProjectDto> dtolist = prjList.stream()
				.map(ProjectDto::fromEntity)
				.collect(Collectors.toCollection(ArrayList::new));
		
		return (ArrayList<ProjectDto>) dtolist;
	}

	@Override
	public HashMap<Integer, ProjectDto> getAllProjInfo() {
		// TODO HashMap으로 project 전체 정보 반환
		List<ProjectEntity> prjList = prepository.findAll();
		HashMap<Integer,ProjectDto> map = new HashMap<Integer,ProjectDto>();
		//dto 로 타입 변환
	    for (ProjectEntity entity : prjList) {
	        map.put(entity.getProjPkNum(), ProjectDto.fromEntity(entity)); // 키: projPkNum, 값: ProjectDto
	    }
		return map;
	}

	
	@Override
	public Optional<ProjectDto> getOneProjectInfo(int proj_pk_num) {
		// TODO proj_pk_num 에 해당하는 프로잭트 가져오기
		Optional<ProjectEntity> prjEntity = prepository.findById(proj_pk_num);
		
		return prjEntity.map(ProjectDto::fromEntity);
	}


}
