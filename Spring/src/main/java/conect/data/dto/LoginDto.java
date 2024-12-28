package conect.data.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class LoginDto {
    private int user_pk_num; // 사번
    private String user_id; // 사용자 ID
    private String user_name; // 이름
    private String user_mail; // 메일
    private String user_pic; // 사진
    private String user_pictype; // 사진 확장자
    private int user_fk_acc_authornum; // 계정 권한 번호
    private int user_fk_comp_num; // 회사 번호
    private int status; // 로그인 상태 번호로 표시 1 성공, 2 : 정보 불일치, 3 : 잠긴 계정
    private int user_trynum; // 유저가 로그인 시도 횟수
    private int user_author; // 유저 권한
    private String accessToken; // JWT 액세스 토큰
    private String refreshToken; // JWT 리프레시 토큰
    private Boolean user_locked;

    // getter와 setter 메소드는 Lombok에 의해 자동 생성됩니다.
}
