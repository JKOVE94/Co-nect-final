package conect.data.form;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginForm {
    private int comp_pk_num; // 회사 번호
    private String user_id; // 사용자 ID
    private String user_pw; // 사용자 비밀번호

    // Lombok의 @Getter와 @Setter 어노테이션으로 인해 
    // 각 필드에 대한 getter와 setter 메소드가 자동으로 생성됩니다.

    // 입력값 검증 메소드
    public boolean isValid() {
        return comp_pk_num > 0 &&
               user_id != null && !user_id.isEmpty() &&
               user_pw != null && !user_pw.isEmpty();
    }
}
