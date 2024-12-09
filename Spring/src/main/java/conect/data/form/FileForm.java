package conect.data.form;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileForm {
	private String dirPath; //파일의 주소
	private int size; //파일의 크기
	private String fileName; //파일의 이름
}
