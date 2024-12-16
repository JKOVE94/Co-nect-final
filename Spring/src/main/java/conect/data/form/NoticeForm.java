package conect.data.form;

import java.time.LocalDate;
import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeForm {
	
	//private Integer noti_pk_num; 자동 증가로 삭제
	private String noti_name;
	private String noti_desc;
	private int noti_fk_user_num;
	private int noti_fk_proj_num;
	private LocalDate noti_regdate;
	
	//toEntity
	public static NoticeEntity toEntity(NoticeForm form) {
		NoticeEntity entity = new NoticeEntity();
        entity.setNotiName(form.getNoti_name());
        entity.setNotiDesc(form.getNoti_desc());
		// noti_regdate가 null일 경우 현재 날짜를 설정 -> 나중에 수정 날짜로 변경해주자
		if (form.getNoti_regdate() == null) {
			entity.setNotiRegdate(LocalDate.now());
		} else {
			entity.setNotiRegdate(form.getNoti_regdate());
		}
        return entity;
    }

}
