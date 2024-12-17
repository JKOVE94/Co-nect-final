package conect.security;

import conect.data.entity.UserEntity;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserSecurityService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userPkNum) throws UsernameNotFoundException {
        UserEntity user = userRepository.findById(Integer.parseInt(userPkNum))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userPkNum));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");

        return new UserSecurityDetails(
                String.valueOf(user.getUserPkNum()),
                user.getUserId(),
                user.getUserPw(),
                user.getUserLocked() != 1,
                Collections.singletonList(authority)
        );
    }
}


