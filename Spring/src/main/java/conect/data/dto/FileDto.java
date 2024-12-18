package conect.data.dto;

import java.time.LocalDate;
import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileDto {
    private int file_pk_num; // 파일 고유번호
    private String file_name; // 파일명
    private String file_path; // 파일 경로
    private int file_size; // 파일 크기
    private String file_type; // 파일 타입
    private Integer file_fk_wiki_num; // 위키 엔티티 번호
    private WikiDto wiki; // 위키 정보를 담는 DTO
    private LocalDate wiki_regdate; // 등록일
    private int wiki_view; // 조회수

    // Entity -> DTO 변환 메서드
    public static FileDto fromEntity(FileEntity entity) {
        FileDto dto = new FileDto();
        dto.setFile_pk_num(entity.getFilePkNum());
        dto.setFile_name(entity.getFileName());
        dto.setFile_path(entity.getFilePath());
        dto.setFile_size(entity.getFileSize());
        dto.setFile_type(entity.getFileType());

        // WikiEntity 정보가 존재하면 WikiDto를 생성하고 설정
        WikiEntity wikiEntity = entity.getWikiEntity();
        if (wikiEntity != null) {
            WikiDto wikiDto = new WikiDto();
            wikiDto.setWiki_title(wikiEntity.getWikiTitle());
            wikiDto.setWiki_content(wikiEntity.getWikiContent());

            dto.setWiki(wikiDto);
            dto.setFile_fk_wiki_num(wikiEntity.getWikiPkNum());
            dto.setWiki_regdate(wikiEntity.getWikiRegdate());
            dto.setWiki_view(wikiEntity.getWikiView());
        }
        return dto;
    }
}
