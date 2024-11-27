package conect.controller;

import conect.data.dto.UserDto;
import conect.data.form.UserForm;
import conect.service.manage.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manage")
public class ManageController {

    @Autowired
    private UserService userService;

    //----------유저관리 (/manage/user)----------
    //유저 전체 정보 얻기
    @GetMapping("/user")
    public List<UserDto> getUserAll(){
        return userService.getUserAll();
    }

    //잠긴 계정 정보 얻기
    @GetMapping("/user/locked")
    public List<UserDto> getLockedAll(){
        return userService.getLockedUserAll();
    }
    //잠긴 계정 정보 수정
    @PutMapping("/user/locked")
    public boolean getLockedAll(@RequestBody List<UserForm> forms){
        return userService.unlockUser(forms);
    }
}
