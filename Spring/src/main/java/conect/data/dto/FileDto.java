package conect.data.dto;

import java.time.LocalDate;
import conect.data.entity.FileEntity;
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
	private int wiki_fk_num; // 위키 엔티티 번호
	private LocalDate wiki_regdate; // 등록일
	private int wiki_view; // 조회수

	public static FileDto fromEntity(FileEntity entity) {
		FileDto dto = new FileDto();
		dto.setFile_pk_num(entity.getFilePkNum());
		dto.setFile_name(entity.getFileName());
		dto.setFile_path(entity.getFilePath());
		dto.setFile_size(entity.getFileSize());
		dto.setFile_type(entity.getFileType());

		// 위키 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
		if (entity.getWikiEntity() != null) {
			dto.setWiki_fk_num(entity.getWikiEntity().getWikiPkNum()); // 예시: 위키 엔티티의 PK 값으로 수정
			dto.setWiki_regdate(entity.getWikiEntity().getWikiRegdate());
			dto.setWiki_view(entity.getWikiEntity().getWikiView());
		}
		return dto;
	}
}
