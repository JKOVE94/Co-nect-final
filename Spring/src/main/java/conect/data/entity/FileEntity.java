package conect.data.entity;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "file")
public class FileEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int filePkNum;
	private String filePostName;
	private String fileName;
	private String filePath; 
	private int fileSize; 
	private String fileType; 
	private int fileDownload; 
	private LocalDate fileRegdate; 
	
	// 게시글 작성자 (UserEntity와 다대일 관계)
	@ManyToOne
	@JoinColumn(name = "file_fk_user_num")
	@JsonIgnore // 순환 참조 방지를 위해 JSON 직렬화에서 제외
	private UserEntity userEntity;
}
