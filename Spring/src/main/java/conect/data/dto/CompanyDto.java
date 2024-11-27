package conect.data.dto;

import conect.data.entity.CompanyEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CompanyDto {
	private int comp_pk_num;
	private String comp_name;
	private String comp_pic;
	private List<UserDto> user_entities;

	public static CompanyDto fromEntity(CompanyEntity entity) {
		CompanyDto dto = new CompanyDto();
		dto.setComp_pk_num(entity.getCompPkNum());
		dto.setComp_name(entity.getCompName());
		dto.setComp_pic(entity.getCompPic());
		dto.setUser_entities(entity.getUserEntities().stream().map(UserDto::fromEntity).toList());
		return dto;
	}
}