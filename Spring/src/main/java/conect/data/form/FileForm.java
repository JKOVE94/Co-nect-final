package conect.data.form;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileForm {
	private int file_pk_num; // 파일 고유 번호 [PK,INT]
	private String file_post_name; // 파일이 업로드된 게시글 이름 [VARCHAR]
	private String file_name; // 업로드된 파일 이름 [VARCHAR]
	private String file_path; // 파일 구글 클라우드 경로 [VARCHAR]
	private int file_size; // 파일 크기  [BIGINT]
	private String file_type; // 파일 타입 [VARCHAR]
	private int file_download; // 파일 다운로드 수 [INT]
	private int file_fk_user_num; // 파일 업로드한 유저의 사번 [FK, INT]
	private LocalDate file_regdate; // 파일 등록일 [DATETIME]
}
