package conect.data.dto;

import conect.data.entity.CompanyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDto {
	private int comp_pk_num; //회사 고유번호 [PK, INT]
	private String comp_name; //회사 명 [VARCHAR]
	private String comp_pic; //회사 로고사진 경로 [VARCHAR] ( 0_asset/emp_pic)
	private String comp_addr; //회사 주소 [VARCHAR]
	private String comp_tel; //회사 전화번호 [VARCHAR]
	private String comp_website; //회사 웹사이트 [VARCHAR]
	private int comp_totalEmp; //회사 직원 수 [INT]
	private int comp_completeProject; //완료된 프로젝트 수 [INT]
	private int comp_totalProject; //전체 프로젝트 수 [INT]

	public static CompanyDto fromEntity(CompanyEntity entity) {
		CompanyDto dto = new CompanyDto();
		dto.setComp_pk_num(entity.getCompPkNum());
		dto.setComp_name(entity.getCompName());
		dto.setComp_pic(entity.getCompPic());
		dto.setComp_addr(entity.getCompAddr());
		dto.setComp_tel(entity.getCompTel());
		dto.setComp_website(entity.getCompWebsite());
		return dto;
	}
}