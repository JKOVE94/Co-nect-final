package conect.data.dto;

import conect.data.entity.DepartmentEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DepartmentDto {
    private int dpart_pk_num; //부서 번호 [PK, INT]
    private String dpart_name; //부서 이름 [VARCHAR]
    private String dpart_mail; //부서 이메일 [VARCHAR]
    private int dpart_fk_dpart_num; //상위 부서 번호 [FK, INT]

    public static DepartmentDto fromEntity(DepartmentEntity entity) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDpart_pk_num(entity.getDpartPkNum());
        dto.setDpart_name(entity.getDpartName());
        dto.setDpart_mail(entity.getDpartMail());
        dto.setDpart_fk_dpart_num(entity.getDpartFkDpartNum());
        return dto;
    }
}