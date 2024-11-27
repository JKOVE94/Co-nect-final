package conect.data.dto;

import conect.data.entity.AccountEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccountDto {
    private int acc_pk_authornum; //계정 권한 고유번호 [PK, INT] (1, 2, 3)
    private String acc_author; //계정 권한 [VARCHAR] (일반사용자, 매니저, 관리자)

    public static AccountDto fromEntity(AccountEntity entity) {
        AccountDto dto = new AccountDto();
        dto.setAcc_pk_authornum(entity.getAccPkAuthornum());
        dto.setAcc_author(entity.getAccAuthor());
        return dto;
    }
}