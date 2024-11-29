package conect.service.common;

import conect.data.form.LoginForm;

public interface LoginService {
    int checkLogin(LoginForm form);
    int getTryNum(int user_pk_num);

}
