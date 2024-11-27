package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.repository.ProjectRepository;

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
	
}
