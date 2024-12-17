package conect.data.form;

import conect.data.entity.CompanyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyForm {
    private int comp_pk_num; //회사 고유번호 [PK, INT]
    private String comp_name; //회사 명 [VARCHAR]
    private String comp_pic; //회사 로고사진 경로 [VARCHAR] ( 0_asset/emp_pic)
    private String comp_addr; //회사 주소 [VARCHAR]
    private String comp_tel; //회사 전화번호 [VARCHAR]
    private String comp_website; //회사 웹사이트 [VARCHAR]

    public static CompanyEntity toEntity(CompanyForm form) {
        CompanyEntity entity = new CompanyEntity();
        entity.setCompPkNum(form.getComp_pk_num());
        entity.setCompName(form.getComp_name());
        entity.setCompPic(form.getComp_pic());
        entity.setCompAddr(form.getComp_addr());
        entity.setCompTel(form.getComp_tel());
        entity.setCompWebsite(form.getComp_website());
        return entity;
    }
}