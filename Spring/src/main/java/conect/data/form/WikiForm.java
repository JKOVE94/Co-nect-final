package conect.data.form;

import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

@Setter
@Getter
public class WikiForm {
    private int wiki_pk_num; // 위키 고유번호
    private String wiki_title; // 위키 제목
    private String wiki_content; // 위키 내용
    private boolean wiki_isnotice; // 공지사항 여부
    private LocalDate wiki_regdate; // 작성일
    private int wiki_view; // 조회수
    private boolean wiki_boardtype; // 게시판 종류
    private int wiki_fk_user_num; // 사용자 고유번호
    private int wiki_fk_proj_num; // 프로젝트 고유번호
    private MultipartFile fileInput;
    private String file_name; // 파일명 추가
    private String file_path; // 파일 경로
    private String fileStatus;

    public static WikiEntity toEntity(WikiForm form) {
        WikiEntity entity = new WikiEntity();
        entity.setWikiPkNum(form.getWiki_pk_num());
        entity.setWikiTitle(form.getWiki_title());
        entity.setWikiContent(form.getWiki_content());
        entity.setWikiIsnotice(form.wiki_isnotice);
        entity.setWikiRegdate(form.getWiki_regdate());
        entity.setWikiView(form.getWiki_view());
        entity.setWikiBoardtype(form.wiki_boardtype);
        return entity;
    }
}
