package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;


@Setter
@Getter
@Entity
@Table(name = "reply")
public class ReplyEntity {

    @Id
    private int replyPkNum; //댓글 번호 [PK, INT]
    private String replyContent; //댓글 내용 [TEXT]
    private int replyParent; //댓글과 대댓글이 속한 그룹 [INT]
    private LocalDateTime replyRegdate; //댓글 등록일 [DATETIME]
    private int replyDepth; //댓글의 깊이 [INT]

    @ManyToOne
    @JoinColumn(name="reply_fk_rec_num")
    @JsonIgnore
    private RecommendationEntity recommendationEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_user_num")
    @JsonIgnore
    private UserEntity userEntity;
    
    @OneToMany(mappedBy = "replyEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    List<ReplyLikesEntity> replylikesEntities;

}