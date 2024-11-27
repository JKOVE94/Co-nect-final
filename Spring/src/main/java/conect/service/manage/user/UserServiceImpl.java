package conect.service.manage.user;

import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.UserForm;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDto> getUserAll() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserOne(int userno) {
        return UserDto.fromEntity(userRepository.findById(userno).get());
    }

    @Override
    public List<UserDto> getLockedUserAll() {
        return userRepository.findLockedUser().stream()
                .map(UserDto :: fromEntity)
                .collect(Collectors.toList());
    }

    @Modifying
    @Override
    public boolean unlockUser(List<UserForm> forms) {
        try {
            forms.forEach(e -> {
                UserEntity user =  userRepository.findById(e.getUser_pk_num()).get();
                user.setUserLocked(e.getUser_locked());
            });

            return true;
        }catch (Exception e){
            System.out.println("unlockUser err :"+e);
            return false;
        }
    }
}
