package conect.service.manage.proj;

import conect.data.dto.ProjectDto;
import conect.data.dto.ProjectmemberDto;
import conect.data.entity.ProjectEntity;
import conect.data.entity.ProjectmemberEntity;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.data.form.ProjectmemberForm;
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

    // 생성
    @Override
    public int insertProject(int compPkNum, ProjectForm projectForm) {
//        System.out.println("-----------------");
//        System.out.println(compPkNum);
//        System.out.println(projectForm.getProj_fk_user_num());
//        System.out.println(userRepository.findById(projectForm.getProj_fk_user_num()).get().getUserName());
//        System.out.println("-----------------");
        ProjectEntity projectEntity = ProjectForm.toEntity(projectForm);
        projectEntity.setCompanyEntity(companyRepository.findById(compPkNum).get());
        projectEntity.setUserEntity(userRepository.findById(projectForm.getProj_fk_user_num()).get());
        return projectRepository.save(projectEntity).getProjPkNum();

    }

    // 부분 조회, 조회수(Cookie)
    @Override
    public ProjectDto getProjectView(int compPkNum, int ProjectPkNum) {
        return ProjectDto.fromEntity(projectRepository.findByProjCompNumAndProjPkNum(compPkNum, ProjectPkNum));
    }

//     수정
    @Override
    public boolean updateProject(int compPkNum, int projNum, ProjectForm form) {
        try{
        ProjectEntity projectEntity = projectRepository.findByProjCompNumAndProjPkNum(compPkNum, projNum);
        projectEntity.setProjTitle(form.getProj_title());
        projectEntity.setProjContent(form.getProj_content());
        projectEntity.setProjStartdate(form.getProj_startdate());
        projectEntity.setProjEnddate(form.getProj_enddate());
        projectEntity.setProjStatus(form.getProj_status());
        projectEntity.setProjUpdated(form.getProj_updated());
        projectRepository.save(projectEntity);
        }
        catch (Exception e) {
            System.out.println("프로젝트 수정 실패" + e);
            return false;
        }
        return true;
    }

    // 페이징, 정렬, 검색
    public Page<ProjectDto> getList(int compPkNum, int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText) {
        // 정렬 정보 생성
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);

        // Pageable 객체 생성 (페이지와 정렬 정보 포함)
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Repository를 통해 데이터를 조회
        Page<ProjectEntity> ProjectPage = Page.empty();

        if (searchType.equalsIgnoreCase("title")) {
            ProjectPage = projectRepository.findByProjSearchTitleWithPaging(compPkNum, searchText, pageable);
        } else if (searchType.equalsIgnoreCase("content")) {
            ProjectPage = projectRepository.findByProjSearchContentWithPaging(compPkNum, searchText, pageable);
        } else {
            ProjectPage = projectRepository.findByProjCompNumWithPaging(compPkNum, pageable);
        }
        // ProjectEntity -> ProjectDto 변환
        return ProjectPage.map(ProjectDto::fromEntity);
    }

    @Override
    @Transactional
    public boolean deleteProject(int compPkNum, int proj_pk_num) {
        try {
            projectRepository.deleteByProjCompNumAndProjPkNum(compPkNum,proj_pk_num);
        } catch (Exception e) {
            System.out.println("프로젝트 삭제 실패" + e);
            return false;
        }
        return true;
    }

    //------------------------------------프로젝트 멤버-------------------------------------------------------------

    @Override
    public List<ProjectmemberDto> getProjectMembers(int compPkNum, int projPkNum) {
        List<ProjectmemberEntity> projectmemberEntities = projectMemberRepository.findByProjmemFkProjNum(projPkNum);
        return projectmemberEntities.stream()
                .filter(entity -> entity.getUserEntity() != null && entity.getUserEntity().getCompanyEntity() != null && entity.getUserEntity().getCompanyEntity().getCompPkNum()==compPkNum)
                .map(ProjectmemberDto::fromEntity)
                .map(dto -> {dto.setProjmem_name(userRepository.findById(dto.getProjmem_fk_user_num()).get().getUserName()); return dto;})
                .collect(Collectors.toList());
    }

    @Override
    public boolean insertProjectMembers(int compPkNum, ProjectmemberForm form){
        try{
            for(int userNum : form.getProjmem_fk_user_num()){
                ProjectmemberEntity projectmemberEntity = new ProjectmemberEntity();
                projectmemberEntity.setProjectEntity(projectRepository.findById(form.getProjmem_fk_proj_num()).get());
                projectmemberEntity.setUserEntity(userRepository.findById(userNum).get());
                projectMemberRepository.save(projectmemberEntity);
            }
        }catch (Exception e){
            System.out.println("프로젝트 멤버 추가 실패" + e);
            return false;
        }
        return true;
    }

    @Override
    public boolean updateProjectMembers(int compPkNum, ProjectmemberForm form){
        try{
            //기존 멤버 리스트 => 새로운 값과 비교해서 중복되지 않는 데이터는 삭제, 중복되는 데이터는 잔류
            List<ProjectmemberEntity> originalMemberList = projectMemberRepository.findByProjmemFkProjNum(form.getProjmem_fk_proj_num());
            List<Integer> originalMemberNumList = originalMemberList.stream()
                    .map(ProjectmemberEntity::getUserEntity)
                    .map(UserEntity::getUserPkNum)
                    .collect(Collectors.toList());

            //비교해서 삭제할 멤버 찾기
            List<Integer> deleteMemeberNums = new ArrayList<>();
            for(int num : originalMemberNumList){
                if(!Arrays.stream(form.getProjmem_fk_user_num()).anyMatch(i -> i == num)){
                    deleteMemeberNums.add(num);
                }
            }

            //기존에 있던 멤버중 제거된 멤버 삭제
            for(int userNum : deleteMemeberNums){
                ProjectmemberEntity projectmemberEntity = projectMemberRepository.findByProjmemFkProjNumAndProjmemFkUserNum(form.getProjmem_fk_proj_num(), userNum);
                projectMemberRepository.delete(projectmemberEntity);
            }

            //기존에 없던 멤버 추가
            for(int userNum : form.getProjmem_fk_user_num()){
                if(!originalMemberNumList.contains(userNum)){
                    ProjectmemberEntity projectmemberEntity = new ProjectmemberEntity();
                    projectmemberEntity.setProjectEntity(projectRepository.findById(form.getProjmem_fk_proj_num()).get());
                    projectmemberEntity.setUserEntity(userRepository.findById(userNum).get());
                    projectMemberRepository.save(projectmemberEntity);
                }
            }

        }catch (Exception e){
            System.out.println("프로젝트 멤버 수정 실패" + e);
            return false;
        }
        return true;
    }

    @Override
    public boolean deleteProjectMembers(int compPkNum, ProjectmemberForm form){
        try{
            for(int userNum : form.getProjmem_fk_user_num()){
                ProjectmemberEntity projectmemberEntity = projectMemberRepository.findByProjmemFkProjNumAndProjmemFkUserNum(form.getProjmem_fk_proj_num(), userNum);
                projectMemberRepository.delete(projectmemberEntity);
            }
        }catch (Exception e){
            System.out.println("프로젝트 멤버 삭제 실패" + e);
            return false;
        }
        return true;
    }

    @Override
    public List<ProjectDto> getProjectListWithUser(int compPkNum, int userPkNum) {
        return projectRepository.findByProjCompNumAndUserPkNum(compPkNum, userPkNum).stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }
}