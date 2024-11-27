package conect.data.form;

import conect.data.entity.AccountEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountForm {
    private int acc_pk_authornum;
    private String acc_author;

    public static AccountEntity toEntity(AccountForm form) {
        AccountEntity entity = new AccountEntity();
        entity.setAccPkAuthornum(form.getAcc_pk_authornum());
        entity.setAccAuthor(form.getAcc_author());
        return entity;
    }
}