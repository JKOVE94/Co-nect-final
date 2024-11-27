package conect.data.form;

import conect.data.entity.AccountEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountForm {
    private int acc_pk_authornum;
    private String acc_author;

    public AccountEntity toEntity() {
        AccountEntity entity = new AccountEntity();
        entity.setAccPkAuthorNum(this.acc_pk_authornum);
        entity.setAccAuthor(this.acc_author);
        return entity;
    }
}