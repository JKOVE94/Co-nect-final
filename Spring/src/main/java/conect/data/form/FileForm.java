package conect.data.form;

import org.springframework.web.multipart.MultipartFile;

import conect.data.entity.FileEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileForm {
	
	private Integer file_pk_num; // 파일 고유번호
	private String file_name; // 파일명
	private String file_path; // 파일 경로
	private int file_size; // 파일 크기
	private String file_type; // 파일 타입
	private Integer file_fk_wiki_num; // 문서 고유 넘버
	private MultipartFile file;

	public static FileEntity toEntity(FileForm form) {
		FileEntity entity = new FileEntity();
		entity.setFilePkNum(form.getFile_pk_num());
		entity.setFileName(form.getFile_name());
		entity.setFilePath(form.getFile_path());
		entity.setFileSize(form.getFile_size());
		entity.setFileType(form.getFile_type());
		return entity;
	}
}