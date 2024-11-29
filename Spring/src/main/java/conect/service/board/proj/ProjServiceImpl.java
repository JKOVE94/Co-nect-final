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


	public ArrayList getAllProjInfo(int compNum) {
		// TODO 회사 코드별 프로젝트 목록 부르기
		ArrayList<ProjectEntity> prjLists = prepository.findByCompanyEntity_CompPkNum(compNum);
		return prjLists;
			
	}
		

     
    


}
