package conect.data.form;

import conect.data.entity.DepartmentEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentForm {
    private int dpart_pk_num;
    private String dpart_name;
    private String dpart_mail;
    private int dpart_fk_dpart_num;

    public DepartmentEntity toEntity() {
        DepartmentEntity entity = new DepartmentEntity();
        entity.setDpartPkNum(this.dpart_pk_num);
        entity.setDpartName(this.dpart_name);
        entity.setDpartMail(this.dpart_mail);
        entity.setDpartFkDpartNum(this.dpart_fk_dpart_num);
        return entity;
    }
}