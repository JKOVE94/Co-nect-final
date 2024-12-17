package conect.data.dto;

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
	private int file_fk_wiki_num; // 위키 엔티티 번호

	public static FileDto fromEntity(FileEntity fileEntity) {
		FileDto fileDto = new FileDto();
		fileDto.setFile_pk_num(fileEntity.getFilePkNum());
		fileDto.setFile_name(fileEntity.getFileName());
		fileDto.setFile_path(fileEntity.getFilePath());
		fileDto.setFile_size(fileEntity.getFileSize());
		fileDto.setFile_type(fileEntity.getFileType());
		fileDto.setFile_fk_wiki_num(fileEntity.getWikiEntity().getWikiPkNum());
/*
		// 위키 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
		if (fileEntity.getWikiEntity() != null) {
			 // 예시: 위키 엔티티의 PK 값으로 수정
		}		*/
		return fileDto;

	}

}
