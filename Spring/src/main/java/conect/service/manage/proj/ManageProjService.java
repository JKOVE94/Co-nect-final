package conect.service.manage.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
import conect.data.form.ProjectForm;
import conect.data.form.ProjectForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ManageProjService {
    // 삽입
    boolean insertProject(ProjectForm projectForm);

    // 전체 조회
//    List<ProjectDto> getProjectAll(int comp_pk_num);

    // 부분 조회 및 조회수 증가
    ProjectDto getProjectView(int ProjectPkNum);

    // 수정
    ProjectDto updateProject(int ProjectPkNum, ProjectForm ProjectForm);

    // 삭제
    void deleteProject(int ProjectPkNum);

    // 페이징
    Page<ProjectDto> getList(int comp_pk_num, int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

    // targetNum 여러명 이름 불러오기
    List<Map<Integer,String>> getTargetNames(String targetNumsString);
}
