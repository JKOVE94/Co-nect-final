package conect.data.form;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginForm {
    private int comp_pk_num;
    private String user_id;  // user_pk_num 대신 user_id 사용
    private String user_pw;
}
