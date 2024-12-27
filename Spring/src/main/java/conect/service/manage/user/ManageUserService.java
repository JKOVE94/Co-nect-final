package conect.service.manage.user;

import conect.data.dto.CompanyDto;
import conect.data.dto.UserDto;
import conect.data.form.UserForm;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.List;

public interface ManageUserService {


    //----------------- 유저 관련 -----------------
    List<UserDto> getUserAll(int comp_pk_num);
    UserDto getUserOne(int comp_pk_num, int userno);
    List<UserDto> getLockedUserAll(int comp_pk_num);
    boolean unlockUser(int comp_pk_num, Integer[] usernos);
    @Transactional
    boolean deleteUser(int comp_pk_num, int userno);
    @Transactional
    boolean updateUser(UserForm form);
    String saveImage(UserForm form) throws IOException; //이미지 저장 메소드
    boolean deleteImage(int user_pk_num); //이미지 삭제 메소드
    boolean insertUser(UserForm form); //유저 등록 메소드
    boolean resetPassword(int comp_pk_num, int userno); //비밀번호 초기화 메소드
    //----------------- 프로젝트 관련 -----------------
}
