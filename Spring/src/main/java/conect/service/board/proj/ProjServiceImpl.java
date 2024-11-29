package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;
	
	public List<ProjectDto> getScheduleAll(int usernum){
		String pattern = "(?<=,|^)"+ usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	
	public List<ProjectDto> getListAll(){
		return prepository.findAll().stream().map(ProjectDto::fromEntity).toList();
	}
	
	public ProjectDto getProjById(int projPkNum) {
	    return prepository.findById(projPkNum)
	        .map(ProjectDto::fromEntity)
	        .orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다. ID: " + projPkNum));
	}
	
}
