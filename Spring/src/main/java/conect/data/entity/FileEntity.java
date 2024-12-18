package conect.data.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    @JsonBackReference    
    private WikiEntity wikiEntity;
    
 // wikiRegdate를 연관 엔티티에서 가져오기 위한 @Transient 필드
    @Transient
    private String wikiRegdate;

    // 연관 엔티티에서 regdate 값을 가져오는 getter
    public LocalDate getWikiRegdate() {
        return wikiEntity != null ? wikiEntity.getWikiRegdate() : null;
    }
}