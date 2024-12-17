package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name="file")
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int filePkNum; //파일 고유번호 [PK, INT]
    private String fileName; //파일명 [VARCHAR]
    private String filePath; //파일 경로 [VARCHAR]
    private int fileSize; //파일 크기 [INT]
    private String fileType; //파일 타입 [VARCHAR]

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_fk_wiki_num")
    private WikiEntity wikiEntity;
}