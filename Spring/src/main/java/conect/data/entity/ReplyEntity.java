package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "reply")
public class ReplyEntity {
    @Id
    private int replyPkNum; //댓글 번호 [PK, INT]
    private String replyCont; //댓글 내용 [TEXT]
    private int replyParent; //댓글과 대댓글이 속한 그룹 [INT]
    private LocalDate replyRegdate; //댓글 등록일 [DATETIME]
    private int replyDepth; //댓글의 깊이 [INT]

    @ManyToOne
    @JoinColumn(name="reply_fk_rec_renum")
    @JsonIgnore
    private RecommendationEntity recommendationEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_user_renum")
    @JsonIgnore
    private UserEntity userEntity;
}