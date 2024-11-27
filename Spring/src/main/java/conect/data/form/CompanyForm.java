package conect.data.form;

import conect.data.entity.CompanyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyForm {
    private int comp_pk_num;
    private String comp_name;
    private String comp_pic;

    public static CompanyEntity toEntity(CompanyForm form) {
        CompanyEntity entity = new CompanyEntity();
        entity.setCompPkNum(form.getComp_pk_num());
        entity.setCompName(form.getComp_name());
        entity.setCompPic(form.getComp_pic());
        return entity;
    }
}