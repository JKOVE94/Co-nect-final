package conect.controller;

import conect.data.dto.*;
import conect.data.form.CompanyForm;
import conect.data.form.ProjectForm;
import conect.data.form.ProjectmemberForm;
import conect.data.form.UserForm;
import conect.service.manage.comp.ManageCompService;
import conect.service.manage.proj.ManageProjService;
import conect.service.manage.user.ManageUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("{comp_pk_num}/manage")
public class ManageController {

    @Autowired
    private ManageUserService manageUserService;

    @Autowired
    private ManageCompService manageCompService;

    @Autowired
    private ManageProjService manageProjService;

    //------------- 회사 관리 (/manage/comp) -------------
    @GetMapping("/comp")
    public CompanyDto getCompInfo(@PathVariable("comp_pk_num") int compNum) {
        return manageCompService.getCompanyInfo(compNum);
    }

    @PutMapping("/comp")
    public void updateCompInfo(@PathVariable("comp_pk_num") String compNum, @RequestBody CompanyForm form) {
        manageCompService.updateCompanyInfo(form, Integer.parseInt(compNum));
    }

    //----------사원관리 (/manage/user)----------
    //유저 전체 정보 얻기
    @GetMapping("/user")
    public List<UserDto> getUserAll(@PathVariable(name = "comp_pk_num") int comp_pk_num) {
        return manageUserService.getUserAll(comp_pk_num);
    }

    //한명의 유저 정보 얻기
    @GetMapping("/user/{userno}")
    public UserDto getUserOne(@PathVariable(name = "comp_pk_num") int comp_pk_num, @PathVariable(name = "userno") int userno) {
//        System.out.println("userno : " +userno);
//        System.out.println("comp_pk_num" + comp_pk_num);
        return manageUserService.getUserOne(userno, comp_pk_num);
    }

    //유저 삭제
    @DeleteMapping("/user/{userno}")
    public boolean deleteUser(@PathVariable(name = "comp_pk_num") int comp_pk_num, @PathVariable(name = "userno") int userno) {
        return manageUserService.deleteUser(comp_pk_num, userno);
    }

    //잠긴 계정 정보 얻기
    @GetMapping("/user/locked")
    public List<UserDto> getLockedAll(@PathVariable(name = "comp_pk_num") int comp_pk_num) {
        return manageUserService.getLockedUserAll(comp_pk_num);
    }

    //잠긴 계정 정보 수정
    @PutMapping("/user/locked")
    public boolean getLockedAll(@PathVariable(name = "comp_pk_num") int comp_pk_num, @RequestBody Integer[] checkedNumber) {
        manageUserService.unlockUser(comp_pk_num, checkedNumber);
        return true;
    }

    /* 반환 코드 정리
    1. 성공
    2. 이미지 파일이 아님
    3. 파일 크기가 5MB를 초과함
    4. 그 외 에러
     */
    //사원 등록
    @PostMapping("/user")
    public int insertUser(@ModelAttribute UserForm form) {
        MultipartFile file = form.getUser_picfile();
        long MaxFileSize = 5 * 1024 * 1024;
        //검증 로직
        if (file.getContentType().contains("image") == false) {
            return 2;
        }
        file.getOriginalFilename();
        if (file.getSize() > MaxFileSize) {
            return 3;
        }
        try {
            if (manageUserService.insertUser(form)) {
                return 1;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 4;
    }

    //사원 정보 수정
    @PutMapping("/user/{userno}")
    public boolean updateUser(@PathVariable("userno") int userno, @ModelAttribute UserForm form) {
        return manageUserService.updateUser(form);
    }

    @PutMapping("/user/reset/{userno}")
    public boolean resetPassword(@PathVariable("comp_pk_num") int compNum, @PathVariable("userno") int userno) {
        return manageUserService.resetPassword(compNum, userno);
    }


    //----------------- 프로젝트 관리 (/manage/proj) -----------------
    @GetMapping("/proj")
    public ResponseEntity<Map<String, Object>> getAllProjs(
            @PathVariable("comp_pk_num") int compNum,
            @RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
            @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
            @RequestParam(name = "sortField", defaultValue = "projTitle") String sortField, // 정렬 필드
            @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection, // 정렬 방향
            @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색분류
            @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
    ) {
        try {
            int pageSize = 10; // 한 페이지당 항목 수
            int blockSize = 5; // 한 블록당 페이지 버튼 수

            // 페이징 및 정렬 서비스 호출
            Page<ProjectDto> postPage = manageProjService.getList(compNum, page, pageSize, sortField, sortDirection, searchType, searchText);

            // 총 페이지 수
            int totalPages = postPage.getTotalPages();

            // 전체 블록 수
            int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);

            // 현재 블록의 시작 및 끝 페이지 번호 계산
            int blockStart = pageBlock * blockSize; // 블록 시작 페이지
            int blockEnd = Math.min(blockStart + blockSize, totalPages); // 블록 끝 페이지

            // 이전 블록 및 다음 블록 존재 여부
            boolean hasPreviousBlock = pageBlock > 0;
            boolean hasNextBlock = pageBlock < totalBlocks - 1;

            // 응답 객체 구성
            Map<String, Object> response = new HashMap<>();
            // 페이징 제공 메서드 사용
            response.put("projects", postPage.getContent()); // 게시글 데이터 불러오기
            response.put("currentPage", postPage.getNumber()); // 현재 페이지 번호
            response.put("totalItems", postPage.getTotalElements()); // 전체 게시글 수
            // 페이지 당 블럭 설정
            response.put("totalPages", totalPages); // 전체 페이지 수
            response.put("currentBlock", pageBlock); // 현재 블록 번호
            response.put("totalBlocks", totalBlocks); // 총 블록 수
            response.put("blockStart", blockStart); // 현재 블록 시작 페이지 번호
            response.put("blockEnd", blockEnd - 1); // 현재 블록 끝 페이지 번호
            response.put("hasPreviousBlock", hasPreviousBlock); // 이전 블록 존재 여부
            response.put("hasNextBlock", hasNextBlock); // 다음 블록 존재 여부

            // 상태 코드 200과 함께 응답 반환
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생 시
        }
    }

    //프로젝트 상세 조회
    @GetMapping("/proj/{proj_pk_num}")
    public ProjectDto getProj(@PathVariable("comp_pk_num") int compNum, @PathVariable("proj_pk_num") int projNum) {
        return manageProjService.getProjectView(compNum, projNum);
    }

    //프로젝트 등록
    @PostMapping("/proj")
    public int insertProj(@PathVariable("comp_pk_num") int compNum, @RequestBody ProjectForm form) {
        System.out.println("insertProj");
        return manageProjService.insertProject(compNum, form);
    }

    //프로젝트 삭제
    @DeleteMapping("/proj/{proj_pk_num}")
    public boolean deleteProj(@PathVariable("comp_pk_num") int compNum, @PathVariable("proj_pk_num") int projNum) {
        return manageProjService.deleteProject(compNum, projNum);
    }

    //프로젝트 수정
    @PutMapping("/proj/{proj_pk_num}")
    public boolean updateProj(@PathVariable("comp_pk_num") int compNum, @PathVariable("proj_pk_num") int projNum, @RequestBody ProjectForm form) {
        return manageProjService.updateProject(compNum, projNum, form);
    }


    //------ 프로젝트 멤버 관리 (/manage/projmem) ------

    @GetMapping("/projmem/{proj_pk_num}")
    public List<ProjectmemberDto> getProjMem(@PathVariable("comp_pk_num") int compNum, @PathVariable("proj_pk_num") int projNum) {
        return manageProjService.getProjectMembers(compNum, projNum);
    }

    @PostMapping("/projmem")
    public boolean insertProjMem(@PathVariable("comp_pk_num") int compNum, @RequestBody ProjectmemberForm projMemForm) {
        return manageProjService.insertProjectMembers(compNum, projMemForm);
    }

    @PutMapping("/projmem")
    public boolean updateProjMem(@PathVariable("comp_pk_num") int compNum, @RequestBody ProjectmemberForm projMemForm) {
        return manageProjService.updateProjectMembers(compNum, projMemForm);
    }

    @DeleteMapping("/projmem")
    public boolean deleteProjMem(@PathVariable("comp_pk_num") int compNum, @RequestBody ProjectmemberForm projMemForm) {
        return manageProjService.deleteProjectMembers(compNum, projMemForm);
    }

    //----- 채팅용 프로젝트 관리 ----
    @GetMapping("/chatproj/{user_pk_num}")
    public List<ProjectDto> getChatProj(@PathVariable("comp_pk_num") int compNum, @PathVariable("user_pk_num") int userNum) {
        return manageProjService.getProjectListWithUser(compNum, userNum);
    }
}