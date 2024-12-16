package conect.data.form;

import conect.data.entity.FileEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileForm {
	private int file_pk_num; //파일 고유 번호
	private String file_name; //파일명
	private String file_path; // 파일경로
	private int file_size; // 파일크기
	private String file_type; // 파일 타입
	private int file_fk_wiki_num; // 문서 번호
	
	public static FileEntity toEntity(FileForm form) {
        // fk관련된 데이터는 service단에서 findById로 찾아야 함
		FileEntity entity = new FileEntity();
        entity.setFilePkNum(form.getFile_pk_num());
        entity.setFileName(form.getFile_name());
        entity.setFilePath(form.getFile_path());
        entity.setFileSize(form.getFile_size());
        entity.setFileType(form.getFile_type());
        return entity;
    }
}
