package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity

@Table(name = "replylike")
public class ReplyLikesEntity {
    @Id
    private int replylikePkNum; //댓글 좋아요 번호 [PK, INT]

    @ManyToOne
    @JoinColumn(name = "replylike_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "replylike_fk_reply_num")
    private ReplyEntity replyEntity;
}
