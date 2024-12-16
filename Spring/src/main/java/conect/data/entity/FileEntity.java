package conect.data.entity;

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
	private int filePkNum; //파일 고유 번호
	private String fileName; //파일명
	private String filePath; // 파일경로
	private int fileSize; // 파일크기
	private String fileType; // 파일 타입
	
	@ManyToOne
	@JoinColumn(name = "file_fk_wiki_num")
	@JsonIgnore
	private WikiEntity wikiEntity;
}
