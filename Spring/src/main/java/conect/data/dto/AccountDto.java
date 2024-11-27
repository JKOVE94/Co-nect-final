package conect.data.dto;

import conect.data.entity.AccountEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccountDto {
    private int acc_pk_authornum;
    private String acc_author;
    private List<UserDto> user_entities;

    public static AccountDto fromEntity(AccountEntity entity) {
        AccountDto dto = new AccountDto();
        dto.setAcc_pk_authornum(entity.getAccPkAuthorNum());
        dto.setAcc_author(entity.getAccAuthor());
        dto.setUser_entities(entity.getUserEntities().stream().map(UserDto::fromEntity).toList());
        return dto;
    }
}