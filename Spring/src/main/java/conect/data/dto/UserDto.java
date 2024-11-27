package conect.data.dto;

import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class UserDto {
    private int user_pk_num;
    private Date user_regdate;
    private String user_pw;
    private String user_name;
    private String user_mail;
    private String user_pic;
    private String user_rank;
    private Date user_lastlogin;
    private int user_trynum;
    private int user_locked;
    private AccountDto account_entity;
    private CompanyDto company_entity;
    private DepartmentDto department_entity;
    private List<FavoritesDto> favorites_entities;

    public static UserDto fromEntity(UserEntity entity) {
        UserDto dto = new UserDto();
        dto.setUser_pk_num(entity.getUserPkNum());
        dto.setUser_regdate(entity.getUserRegDate());
        dto.setUser_pw(entity.getUserPw());
        dto.setUser_name(entity.getUserName());
        dto.setUser_mail(entity.getUserMail());
        dto.setUser_pic(entity.getUserPic());
        dto.setUser_rank(entity.getUserRank());
        dto.setUser_lastlogin(entity.getUserLastLogin());
        dto.setUser_trynum(entity.getUserTryNum());
        dto.setUser_locked(entity.getUserLocked());
        dto.setAccount_entity(AccountDto.fromEntity(entity.getAccountEntity()));
        dto.setCompany_entity(CompanyDto.fromEntity(entity.getCompanyEntity()));
        dto.setDepartment_entity(DepartmentDto.fromEntity(entity.getDepartmentEntity()));
        dto.setFavorites_entities(entity.getFavoritesEntities().stream().map(FavoritesDto::fromEntity).toList());
        return dto;
    }
}