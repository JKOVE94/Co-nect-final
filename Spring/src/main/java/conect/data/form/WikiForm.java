package conect.data.form;

import java.util.Date;

import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WikiForm {
	private int wiki_pk_num; // 위키문서 번호
	private String wiki_name; // 문서 이름
	private String wiki_desc; // 문서 작성 내용
	private boolean wiki_is_notice; // 공지 여부
	private Date wiki_regdate; // 작성일
	private int wiki_fk_proj_num; // 프로젝트 번호
	private int wiki_fk_user_num; // 문서 작성자
	
	public static WikiEntity toEntity(WikiForm form) {
        // fk관련된 데이터는 servie단에서 findById로 찾아야 함
		WikiEntity entity = new WikiEntity();
        entity.setWikiPkNum(form.getWiki_pk_num());
        entity.setWikiName(form.getWiki_name());
        entity.setWikiDesc(form.getWiki_desc());
        entity.setWikiIsNotice(form.isWiki_is_notice());
        entity.setWikiRegdate(form.getWiki_regdate());
        return entity;
    }
}
