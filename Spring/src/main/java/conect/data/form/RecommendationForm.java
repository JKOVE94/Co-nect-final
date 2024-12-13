package conect.data.form;

import java.time.LocalDateTime;

import conect.data.entity.RecommendationEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationForm {
	private int rec_pk_num; 
	private String rec_title; //제목
	private String rec_content; //내용
	private LocalDateTime rec_date; //작성일자
	
	private int user_pknum;
	private String user_name;
	
	private int proj_pknum;
	
	public static RecommendationEntity toEntity(RecommendationForm form) {
		RecommendationEntity entity = new RecommendationEntity();
		entity.setRecPkNum(form.getRec_pk_num());
		entity.setRecTitle(form.getRec_title());
		entity.setRecContent(form.getRec_content());
		entity.setRecDate(form.getRec_date());
		return entity;
	}
}
