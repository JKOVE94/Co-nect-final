package conect.controller;

import conect.data.dto.UserDto;
import conect.data.form.UserForm;
import conect.service.manage.user.ManageUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/manage")
public class ManageController {

    @Autowired
    private ManageUserService manageUserService;

    //----------유저관리 (/manage/user)----------
    //유저 전체 정보 얻기
    @GetMapping("/user")
    public List<UserDto> getUserAll(){
        return manageUserService.getUserAll();
    }

    //유저 전체 정보 얻기
    @GetMapping("/user/{userno}")
    public UserDto getUserOne(@PathVariable(name="userno") int userno){
        return manageUserService.getUserOne(userno);
    }

    //유저 삭제
    @DeleteMapping("/user/{userno}")
    public boolean deleteUser(@PathVariable(name="userno") int userno){
        return manageUserService.deleteUser(userno);
    }

    //잠긴 계정 정보 얻기
    @GetMapping("/user/locked")
    public List<UserDto> getLockedAll(){
        return manageUserService.getLockedUserAll();
    }

    //잠긴 계정 정보 수정
    @PutMapping("/user/locked")
    public boolean getLockedAll(@RequestBody List<UserForm> forms){
        System.out.println("forms : "+forms.get(0).getUser_pk_num());
        return manageUserService.unlockUser(forms);
    }

    /* 반환 코드 정리
    1. 성공
    2. 이미지 파일이 아님
    3. 파일 크기가 5MB를 초과함
    4. 그 외 에러
     */
    //사원 등록
    @PostMapping("/user")
    public int insertUser(@ModelAttribute UserForm form){
        MultipartFile file = form.getUser_picfile();
        long MaxFileSize = 5 * 1024 * 1024;
        //검증 로직
        if(file.getContentType().contains("image") == false){
            return 2;
        }
        if(file.getSize() > MaxFileSize){
            return 3;
        }
        try {
            if(manageUserService.insertUser(form)) {
                return 1;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 4;
    }

    //사원 정보 수정
    @PutMapping("/user/{user_pk_num}")
    public boolean updateUser(@ModelAttribute UserForm form){
        return manageUserService.updateUser(form);
    }
}