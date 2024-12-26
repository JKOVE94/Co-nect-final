package conect.data.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class LoginDto {
    private Integer user_pk_num; // 사용자 사번
    private String user_id; // 사용자 아이디
    private String user_name; // 사용자 이름
    private String user_mail; // 사용자 이메일
    private String user_pic; // 사용자 사진
    private LocalDateTime user_lastlogin; // 사용자 마지막 로그인 일시
    private int user_trynum; // 사용자 로그인 시도 횟수
    private int user_author; // 사용자 권한
    private boolean user_istemppw; // 사용자 임시 비밀번호 여부
    private int user_fk_comp_num; // 사용자 회사 번호
    private int status; // 로그인 상태
}
