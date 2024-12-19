package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Setter
@Getter
@Entity
@Table(name="wiki")
public class WikiEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int wikiPkNum; //위키 고유번호 [PK, INT]
    private String wikiTitle; //위키 제목 [VARCHAR]
    private String wikiContent; //위키 내용 [TEXT]
    private Boolean wikiIsnotice; //공지사항 여부 [Boolean] (0, 1)
    private LocalDate wikiRegdate; //작성일 [DATE]
    private int wikiView; //조회수 [INT]
    private Boolean wikiBoardtype; //게시판 종류 [Boolean] (1, 2)

    @OneToOne(mappedBy = "wikiEntity", fetch = FetchType.LAZY)
    @JsonManagedReference
    private FileEntity fileEntity;

    @ManyToOne
    @JoinColumn(name = "wiki_fk_user_num", referencedColumnName = "userPkNum")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "wiki_fk_proj_num")
    private ProjectEntity projectEntity;
}
