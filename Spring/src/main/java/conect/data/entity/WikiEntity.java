package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Setter
@Getter
@Entity
@Table(name = "wiki")
public class WikiEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int wikiPkNum; // 위키 고유번호 [PK, INT]
    private String wikiTitle; // 위키 제목 [VARCHAR]
    private String wikiContent; // 위키 내용 [TEXT]
    private boolean wikiIsnotice; // 공지사항 여부 [INT] (0, 1)
    private LocalDate wikiRegdate; // 작성일 [DATE]
    private int wikiView; // 조회수 [INT]
    private boolean wikiBoardtype; // 게시판 종류 [INT] (1, 2)

    @OneToOne(mappedBy = "wikiEntity")
    @JsonBackReference
    private FileEntity fileEntity;

    @ManyToOne
    @JoinColumn(name = "wiki_fk_user_num")
    @JsonIgnore
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "wiki_fk_proj_num")
    @JsonIgnore
    private ProjectEntity projectEntity;
}