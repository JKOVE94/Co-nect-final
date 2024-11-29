package conect.data.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginDto {
    private int comp_pk_num;
    private int user_pk_num;
    private String user_pw;
    private int status; //로그인 상태 번호로 표시 1 성공, 2 : 정보 불일치, 3 : 잠긴 계정
    private int user_trynum; //유저가 로그인 시도 횟수
}
