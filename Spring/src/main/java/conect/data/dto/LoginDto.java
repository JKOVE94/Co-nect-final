package conect.data.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginDto {
    private int user_pk_num; //사번
    private String user_name; //이름
    private String user_mail; //메일
    private String user_pic; //사진
    private int user_author; //계정 권한 번호
    private int user_fk_comp_num; //회사 번호
    private int status; //로그인 상태 번호로 표시 1 성공, 2 : 정보 불일치, 3 : 잠긴 계정
    private int user_trynum; //유저가 로그인 시도 횟수
}
