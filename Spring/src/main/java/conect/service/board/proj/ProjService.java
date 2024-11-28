package conect.service.board.proj;

import java.util.List;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;

public interface ProjService {

	// 프로젝트 생성 메서드
    void createProject(ProjectDto projectDto);
    
	// 전체 목록 조회
    //List<ProjectDto> getAllProjects();
    
    // 상위 부서 번호로 조회
    //List<ProjectEntity> getProjByDept(int dpartPkNum);
}
