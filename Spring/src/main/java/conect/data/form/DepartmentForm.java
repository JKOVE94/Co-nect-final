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

    public static DepartmentEntity toEntity(DepartmentForm form) {
        DepartmentEntity entity = new DepartmentEntity();
        entity.setDpartPkNum(form.getDpart_pk_num());
        entity.setDpartName(form.getDpart_name());
        entity.setDpartMail(form.getDpart_mail());
        entity.setDpartFkDpartNum(form.getDpart_fk_dpart_num());
        return entity;
    }
}