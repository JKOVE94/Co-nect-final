package conect.data.form;

import conect.data.dto.ReclikesDto;
import conect.data.entity.ReclikesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReclikesForm {
	private int reclike_pknum;
	private int reclike_fk_rec_num;
	private int reclike_fk_user_num;
	
	public static ReclikesEntity toEntity(ReclikesForm form) {
		ReclikesEntity entity = new ReclikesEntity();
		entity.setReclikePkNum(form.getReclike_pknum());
		return entity;
	}
}
