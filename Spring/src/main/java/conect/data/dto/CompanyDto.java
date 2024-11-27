package conect.data.dto;

import conect.data.entity.CompanyEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CompanyDto {
	private int comp_pk_num; //회사 고유번호 [PK, INT]
	private String comp_name; //회사 명 [VARCHAR]
	private String comp_pic; //회사 로고사진 경로 [VARCHAR] ( 0_asset/emp_pic)

	public static CompanyDto fromEntity(CompanyEntity entity) {
		CompanyDto dto = new CompanyDto();
		dto.setComp_pk_num(entity.getCompPkNum());
		dto.setComp_name(entity.getCompName());
		dto.setComp_pic(entity.getCompPic());
		return dto;
	}
}