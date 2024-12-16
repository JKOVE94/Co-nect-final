package conect.data.dto;

import conect.data.entity.ReclikesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReclikesDto {
	private int reclike_pknum;
	private int reclike_fk_rec_num;
	private int reclike_fk_user_num;
	
	public static ReclikesDto fromEntity(ReclikesEntity entity) {
		ReclikesDto dto = new ReclikesDto();
		dto.setReclike_fk_rec_num(entity.getRecommendation().getRecPkNum());
		dto.setReclike_fk_user_num(entity.getUser().getUserPkNum());
		dto.setReclike_pknum(entity.getReclikePkNum());
		return dto;
	}
}
