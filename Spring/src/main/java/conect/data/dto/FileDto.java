package conect.data.dto;

import conect.data.entity.FileEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileDto {
	private int file_pk_num; //파일 고유 번호
	private String file_name; //파일명
	private String file_path; // 파일 경로
	private int file_size; // 파일 크기
	private String file_type; // 파일 타입
	private int file_fk_wiki_num; // 문서 번호
	
	public static FileDto fromEntity(FileEntity entity) {
		FileDto dto = new FileDto();
        dto.setFile_pk_num(entity.getFilePkNum());
        dto.setFile_name(entity.getFileName());
        dto.setFile_path(entity.getFilePath());
        dto.setFile_size(entity.getFileSize());
        dto.setFile_type(entity.getFileType());
        dto.setFile_fk_wiki_num(entity.getWikiEntity().getWikiPkNum());
        return dto;
    }
}
