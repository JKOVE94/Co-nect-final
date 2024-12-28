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
        public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
                UserEntity user = userRepository.findByUserId(userId)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserAuthor());

                return new UserSecurityDetails(
                                String.valueOf(user.getCompanyEntity().getCompPkNum()),
                                user.getUserId(),
                                user.getUserPkNum(),
                                user.getUserPw(),
                                !user.getUserLocked(),
                                Collections.singletonList(authority),
                                user.getRefreshToken());
        }

        public UserDetails loadUserByRefreshToken(String refreshToken) {
                UserEntity user = userRepository.findByRefreshToken(refreshToken)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found with refresh token"));

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserAuthor());

                return new UserSecurityDetails(
                                String.valueOf(user.getCompanyEntity().getCompPkNum()),
                                user.getUserId(),
                                user.getUserPkNum(),
                                user.getUserPw(),
                                !user.getUserLocked(),
                                Collections.singletonList(authority),
                                refreshToken);
        }
}
