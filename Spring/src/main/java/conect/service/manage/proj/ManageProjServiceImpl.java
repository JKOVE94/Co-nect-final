package conect.service.manage.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
import conect.data.entity.ProjectmemberEntity;
import conect.data.form.ProjectForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ProjectmemberRepository;
import conect.data.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ManageProjServiceImpl implements ManageProjService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectmemberRepository projectMemberRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    // 삽입
    @Override
    public boolean insertProject(ProjectForm projectForm) {
        ProjectmemberEntity projectMemberEntity = new ProjectmemberEntity();
        ProjectEntity projectEntity = ProjectForm.toEntity(projectForm);

        try{
        projectEntity.setCompanyEntity(companyRepository.findById(projectForm.getProj_fk_comp_num()).get());

        // 프로젝트 멤버 추가
        projectMemberEntity.setProjectEntity(projectEntity);
        projectMemberEntity.setUserEntity(userRepository.findById(projectForm.getProj_fk_user_num()).get());
        projectMemberRepository.save(projectMemberEntity);

        // 프로젝트 추가
        projectRepository.save(projectEntity);
        }catch(Exception e){
            System.out.println("프로젝트 추가 실패"+ e );
            return false;
        }
        return true;
    }

    // 부분 조회, 조회수(Cookie)
    @Override
    public ProjectDto getProjectView(int ProjectPkNum) {
        return projectRepository.findById(ProjectPkNum).map(ProjectDto::fromEntity).orElse(null);
    }

    @Override
    public ProjectDto updateProject(int ProjectPkNum, ProjectForm ProjectForm) {
        return null;
    }

    @Override
    public void deleteProject(int ProjectPkNum) {

    }

    @Override
    public List<Map<Integer, String>> getTargetNames(String targetNumsString) {
        return List.of();
    }

    // 수정
//    @Override
//    public ProjectDto updateProject(int ProjectPkNum, ProjectForm ProjectForm) { // ProjectId를 ProjectPkNum으로 변경
//        ProjectEntity updateProject = frepository.findById(ProjectPkNum).orElse(null); // ProjectId를 ProjectPkNum으로 변경
//        if (updateProject != null) {
//            updateProject.setProjectKind(ProjectForm.getProject_kind());
//            updateProject.setProjectTargetnum(ProjectForm.getProject_targetnum());
//            updateProject.setProjectName(ProjectForm.getProject_name());
//            updateProject.setProjectRegdate(ProjectForm.getProject_regdate());
//            updateProject.setProjectImport(ProjectForm.getProject_import());
//            updateProject.setProjectContent(ProjectForm.getProject_content());
//            updateProject.setProjectTag(ProjectForm.getProject_tag());
//            updateProject.setProjectDepth(ProjectForm.getProject_depth());
//            updateProject.setProjectView(ProjectForm.getProject_view());
//            return ProjectDto.fromEntity(frepository.save(updateProject));
//        }
//        return null;
//    }

    // 삭제
//    @Override
//    public void deleteProject(int ProjectPkNum) {
//        frepository.deleteById(ProjectPkNum);
//    }

    // 페이징, 정렬, 검색
    public Page<ProjectDto> getList(int comp_pk_num, int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText) {
        // 정렬 정보 생성
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);

        // Pageable 객체 생성 (페이지와 정렬 정보 포함)
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Repository를 통해 데이터를 조회
        Page<ProjectEntity> ProjectPage = Page.empty();

        if (searchType.equalsIgnoreCase("title")) {
            ProjectPage = projectRepository.findByProjSearchTitleWithPaging(comp_pk_num, searchText, pageable);
        } else if(searchType.equalsIgnoreCase("content")) {
            ProjectPage = projectRepository.findByProjSearchContentWithPaging(comp_pk_num, searchText, pageable);
        } else {
            ProjectPage = projectRepository.findByProjCompNumWithPaging(comp_pk_num, pageable);
        }
        // ProjectEntity -> ProjectDto 변환
        return ProjectPage.map(ProjectDto::fromEntity);
    }
//
//    //targetNum 여러명 이름 불러오기
//    public List<Map<Integer,String>> getTargetNames(String targetNumsString){
//        StringTokenizer st = new StringTokenizer(targetNumsString,","); // nums String으로 관리하고, 구분자가 ',' 그래서 ,를 기준으로 스트링토크나이저 사용해서 각각의 토큰화
//        List<Integer> userNums = new ArrayList<Integer>(); // 그 토큰을 INTEGER화 해서 담을 LIST => 순서가 필요없고 갯수가 정해져 있지 않아서 array X List O
//        while(st.hasMoreTokens()) {// 토큰이 있을경우
//            userNums.add(Integer.parseInt(st.nextToken())); // 다음 토큰을 찾아 이동하면서 해당 토큰(String) => parseInt => userNums라는 List<Integer>에 담아줌
//        }
//        //userNums 안에 데이터가 생김. 1개~ 그이상
//
//        Map<Integer,String> usermap = new HashMap<>(); // Map<사번, 이름> 정보를 보관하는 맵
//        List<Map<Integer,String>> userMapList = new ArrayList<Map<Integer,String>>(); // 그 맵을 여러개 보관할 리스트
//        for(int num : userNums) {
//            String name = userRepository.findById(num).get().getUserName(); //유저의 번호 1개씩 요청해서 이름만 받아
//            usermap.put(num, name); //받은 이름을 사번, 이름으로 맵 저장 => num으로 조회 => name은 그 num과 같은 데이터일수밖에 없음
//            userMapList.add(usermap); //맵을 List 저장
//        }
//        return userMapList; // [{1:김민수},{2:이영희}] => find 배열을 순환적으로 돌아다니면서 사용자가 입력한 조건에 맞는 1개의 데이터를 찾아
//    }
}
