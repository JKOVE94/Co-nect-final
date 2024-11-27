package conect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        //명시적으로 Security 구성 - Chain method형식으로 설정 가능
        // 커스텀 로그인페이지 설정
        httpSecurity
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/")
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())
                .csrf(csrf-> csrf.disable());

        return httpSecurity.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        //사용자 세부 정보를 관리하는 서비스 정의
        // UserDetailsService : 유저의 정보를 가져오는 인터페이스. 사용자 세부 정보를 관리하는 서비스 정의
        // UserDetails : 사용자의 정보를 담는 인터페이스
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder().encode("123"))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //BCrypt 비밀번호 인코더를 사용해 빈을 생성
    }

}
