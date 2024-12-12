package conect.data.dto;

import java.time.LocalDate;
import conect.data.entity.FileEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileDto {
	private int file_pk_num;
	private String file_post_name;
	private String file_name;
	private String file_path;
	private int file_size;
	private String file_type;
	private int file_download;
	private int file_fk_user_num;
	private LocalDate file_regdate;
	private String user_name;

	
	public static FileDto fromEntity(FileEntity entity) {
		FileDto dto = new FileDto();
		dto.setFile_pk_num(entity.getFilePkNum());
		dto.setFile_post_name(entity.getFilePostName());
		dto.setFile_name(entity.getFileName());
		dto.setFile_path(entity.getFilePath());
		dto.setFile_size(entity.getFileSize());
		dto.setFile_type(entity.getFileType());
		dto.setFile_download(entity.getFileDownload());
		dto.setFile_regdate(entity.getFileRegdate());
		dto.setUser_name(entity.getUserEntity().getUserName());
		
		// UserEntity에서 user_name을 가져와 설정
        if (entity.getUserEntity() != null) {
            dto.setUser_name(entity.getUserEntity().getUserName());
        } else {
            dto.setUser_name(""); // 예를 들어 user_name이 없으면 빈 문자열로 설정
        }
		
		return dto;
	}
}
