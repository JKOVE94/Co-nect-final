package conect.data.form;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginForm {
    private int comp_pk_num;
    private int user_pk_num;
    private String user_pw;
}
