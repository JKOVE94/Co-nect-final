package conect.service.manage.proj;

import conect.data.dto.ProjectDto;
import conect.data.dto.ProjectmemberDto;
import conect.data.entity.ProjectEntity;
import conect.data.form.ProjectForm;
import conect.data.form.ProjectForm;
import conect.data.form.ProjectmemberForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ManageProjService {
    // 삽입
    int insertProject(int compPkNum, ProjectForm projectForm);

    // 부분 조회
    ProjectDto getProjectView(int compPkNum, int ProjectPkNum);

    // 수정
    boolean updateProject(int compPkNum, int projNum, ProjectForm form);

    // 삭제
    boolean deleteProject(int compPkNum, int ProjectPkNum);

    // 페이징
    Page<ProjectDto> getList(int compPkNum, int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

    // 프로젝트 멤버 조회
    List<ProjectmemberDto> getProjectMembers(int compPkNum, int projPkNum);

    // 프로젝트 멤버 삽입
    boolean insertProjectMembers(int compPkNum, ProjectmemberForm form);

    // 프로젝트 멤버 수정
    boolean updateProjectMembers(int compPkNum, ProjectmemberForm form);

    // 프로젝트 멤버 삭제
    boolean deleteProjectMembers(int compPkNum, ProjectmemberForm form);

    //특정 유저가 속한 프로젝트 목록 조회
    List<ProjectDto> getProjectListWithUser(int compPkNum, int userPkNum);
}
