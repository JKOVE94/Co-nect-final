package conect.data.dto;

import java.time.LocalDateTime;

import conect.data.entity.ProjectEntity;
import conect.data.entity.RecommendationEntity;
import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationDto {
	
	private int rec_pk_num; 
	private String rec_title; //제목
	private String rec_content; //내용
	private LocalDateTime rec_regdate; //작성일자
	private int rec_view;
	
	private int user_pknum;
	private String user_name;
	
	public static RecommendationDto fromEntity(RecommendationEntity entity) {
		RecommendationDto dto = new RecommendationDto();
		dto.setRec_title(entity.getRecTitle());
		dto.setRec_pk_num(entity.getRecPkNum());
		dto.setRec_content(entity.getRecContent());
		dto.setRec_regdate(entity.getRecRegdate());
		dto.setUser_pknum(entity.getUserEntity().getUserPkNum());
		dto.setUser_name(entity.getUserEntity().getUserName());
		dto.setRec_view(entity.getRecView());
		return dto;
	}

}
