package conect.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserSecurityDetails implements UserDetails {
    private final String compPkNum;
    private final String userPkNum;
    private final String password;
    private final boolean isAccountNonLocked;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserSecurityDetails(String compPkNum, String userPkNum, String password, boolean isAccountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        this.compPkNum = compPkNum;
        this.userPkNum = userPkNum;
        this.password = password;
        this.isAccountNonLocked = isAccountNonLocked;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userPkNum; // 사용자번호를 username으로 사용
    }

    public String getCompPkNum() {
        return compPkNum;
    }

    public String getUserPkNum() {
        return userPkNum;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isAccountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
