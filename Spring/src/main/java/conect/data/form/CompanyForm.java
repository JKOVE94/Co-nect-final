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

    public CompanyEntity toEntity() {
        CompanyEntity entity = new CompanyEntity();
        entity.setCompPkNum(this.comp_pk_num);
        entity.setCompName(this.comp_name);
        entity.setCompPic(this.comp_pic);
        return entity;
    }
}