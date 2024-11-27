package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "reply")
public class ReplyEntity {
    @Id
    private int replyPkNum; //댓글 번호 [PK, INT]
    private String replyCont; //댓글 내용 {TEXT]

    @ManyToOne
    @JoinColumn(name="reply_fk_porj_num")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_post_num")
    private PostEntity postEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_user_renum")
    private UserEntity userEntity;
}