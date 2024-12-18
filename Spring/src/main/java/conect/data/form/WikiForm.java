package conect.data.form;

import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class WikiForm {
    private int wiki_pk_num; // 위키 고유번호
    private String wiki_title; // 위키 제목
    private String wiki_content; // 위키 내용
    private Boolean wiki_isnotice; // 공지사항 여부
    private LocalDate wiki_regdate; // 작성일
    private int wiki_view; // 조회수
    private Boolean wiki_boardtype; // 게시판 종류
    private int wiki_fk_user_num; // 사용자 고유번호
    private int wiki_fk_proj_num; // 프로젝트 고유번호

    public static WikiEntity toEntity(WikiForm form) {
        WikiEntity entity = new WikiEntity();
        entity.setWikiPkNum(form.getWiki_pk_num());
        entity.setWikiTitle(form.getWiki_title());
        entity.setWikiContent(form.getWiki_content());
        entity.setWikiIsnotice(form.getWiki_isnotice());
        entity.setWikiRegdate(form.getWiki_regdate());
        entity.setWikiView(form.getWiki_view());
        entity.setWikiBoardtype(form.getWiki_boardtype());
        return entity;
    }
}
