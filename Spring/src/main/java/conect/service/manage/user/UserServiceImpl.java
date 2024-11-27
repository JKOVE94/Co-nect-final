package conect.service.manage.user;

import conect.data.dto.UserDto;
import conect.data.form.UserForm;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    
    public Boolean login(int compNum, Model model) {
    	userRepository.existsById(null)
    	
    	
    	return "";
    }
    
    

}
