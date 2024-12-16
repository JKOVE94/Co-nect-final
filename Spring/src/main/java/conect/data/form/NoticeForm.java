package conect.data.form;

import java.time.LocalDate;
import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeForm {
	
	private Integer noti_pk_num;
	private String noti_name;
	private String noti_desc;
	private int noti_fk_user_num;
	private int noti_fk_proj_num;
	private LocalDate noti_regdate;
	
	//toEntity
	public static NoticeEntity toEntity(NoticeForm form) {
		NoticeEntity entity = new NoticeEntity();
        entity.setNotiPkNum(form.getNoti_pk_num());
        entity.setNotiName(form.getNoti_name());
        entity.setNotiDesc(form.getNoti_desc());
		entity.setNotiRegdate(form.getNoti_regdate()); // noti_regdate 설정 추가
        return entity;
    }

}
