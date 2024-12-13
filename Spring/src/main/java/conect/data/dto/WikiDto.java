package conect.data.dto;

import java.util.Date;

import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WikiDto {
	private int wiki_pk_num; // 위키문서 번호
	private String wiki_name; // 문서 이름
	private String wiki_desc; // 문서 작성 내용
	private boolean wiki_is_notice; // 공지 여부
	private Date wiki_regdate; // 작성일
	private int wiki_fk_proj_num; // 프로젝트 번호
	private int wiki_fk_user_num; // 문서 작성자
	
	public static WikiDto fromEntity(WikiEntity entity) {
        WikiDto dto = new WikiDto();
        dto.setWiki_pk_num(entity.getWikiPkNum());
        dto.setWiki_name(entity.getWikiName());
        dto.setWiki_desc(entity.getWikiDesc());
        dto.setWiki_is_notice(entity.isWikiIsNotice());
        dto.setWiki_regdate(entity.getWikiRegdate());
        dto.setWiki_fk_proj_num(entity.getProjectEntity().getProjPkNum());
        dto.setWiki_fk_user_num(entity.getUserEntity().getUserPkNum());
        return dto;
    }
}
