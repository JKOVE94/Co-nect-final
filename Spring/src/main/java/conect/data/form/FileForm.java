package conect.data.form;

import org.springframework.web.multipart.MultipartFile;
import conect.data.entity.FileEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileForm {
	// 이거 MultipartFile로 타입 변환하기
	private int file_pk_num; // 파일 고유 번호 [PK,INT]
	private String file_name; // 업로드된 파일 이름 [VARCHAR]
	private String file_path; // 파일 구글 클라우드 경로 [VARCHAR]
	private int file_size; // 파일 크기  [BIGINT]
	private String file_type; // 파일 타입 [VARCHAR]
	private MultipartFile file;
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
