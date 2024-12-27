package conect.data.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginDto {
    private int user_pk_num;
    private String user_id;
    private String user_name;
    private String user_mail;
    private String user_pic;
    private String user_pictype;
    private int user_fk_acc_authornum;
    private int user_fk_comp_num;
    private int status; // 로그인 상태 번호로 표시 1 성공, 2 : 정보 불일치, 3 : 잠긴 계정
    private int user_trynum; // 유저가 로그인 시도 횟수
    private int user_author; // 유저 권한
    private String accessToken; // JWT 액세스 토큰
    private String refreshToken; // JWT 리프레시 토큰
    private Boolean user_locked;

    // getter와 setter 메소드는 Lombok에 의해 자동 생성됩니다.
}
