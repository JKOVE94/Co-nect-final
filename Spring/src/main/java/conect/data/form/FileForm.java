package conect.data.form;

import org.springframework.web.multipart.MultipartFile;
import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;
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
    private MultipartFile file; // 실제 파일
    private WikiEntity wikiEntity; // WikiEntity 연결, file_fk_wiki_num 대체

    public static FileEntity toEntity(FileForm form) {
        FileEntity entity = new FileEntity();
        entity.setFilePkNum(form.getFile_pk_num());
        entity.setFileName(form.getFile_name());
        entity.setFilePath(form.getFile_path());
        entity.setFileSize(form.getFile_size());
        entity.setFileType(form.getFile_type());
        entity.setWikiEntity(form.getWikiEntity()); // WikiEntity 연결
        return entity;
    }

}
