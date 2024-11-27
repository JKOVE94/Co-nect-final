package conect.service.board.proj;

import java.util.List;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;

public interface ProjService {

	// 프로젝트 생성 메서드
    void createProject(ProjectDto projectDto);
    
    // 부서 번호를 기준으로 프로젝트 리스트 조회 메서드
    List<ProjectEntity> getProjByDept(int dpartPkNum);
}
