package conect.service.manage.user;

import conect.data.dto.UserDto;
import conect.data.form.UserForm;

import java.util.List;

public interface UserService {

    List<UserDto> getUserAll();
    UserDto getUserOne(int userno);
    List<UserDto> getLockedUserAll();
    boolean unlockUser(List<UserForm> forms);

}
