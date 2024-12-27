package conect.data.dto;

import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class WikiDto {
    private int wiki_pk_num; // 위키 고유번호
    private String wiki_title; // 위키 제목
    private String wiki_content; // 위키 내용
    private boolean wiki_isnotice; // 공지사항 여부
    private LocalDate wiki_regdate; // 작성일
    private int wiki_view; // 조회수
    private boolean wiki_boardtype; // 게시판 종류
    private int wiki_fk_user_num; // 사용자 고유번호
    private int wiki_fk_proj_num; // 프로젝트 고유번호
    private String user_name;
    private String file_name; // 파일명 추가
    private String file_path; // 파일 경로

    // Getters and Setters

    public static WikiDto fromEntity(WikiEntity wiki) {
        WikiDto wikiDto = new WikiDto();
        wikiDto.setWiki_pk_num(wiki.getWikiPkNum());
        wikiDto.setWiki_title(wiki.getWikiTitle());
        wikiDto.setWiki_content(wiki.getWikiContent());
        wikiDto.setWiki_isnotice(wiki.isWikiIsnotice());
        wikiDto.setWiki_regdate(wiki.getWikiRegdate());
        wikiDto.setWiki_view(wiki.getWikiView());
        wikiDto.setWiki_boardtype(wiki.isWikiBoardtype());
        wikiDto.setWiki_fk_user_num(wiki.getUserEntity().getUserPkNum());
        wikiDto.setWiki_fk_proj_num(wiki.getProjectEntity().getProjPkNum());
        wikiDto.setUser_name(wiki.getUserEntity().getUserName());

        // 파일이 존재하면 파일 설정, 없으면 null
        if (wiki.getFileEntity() != null) {
            wikiDto.setFile_name(wiki.getFileEntity().getFileName());
            wikiDto.setFile_path(wiki.getFileEntity().getFilePath());
        } else {
            wikiDto.setFile_name(null); // 파일이 없을 경우
            wikiDto.setFile_path(null);
        }

        return wikiDto;
    }
}