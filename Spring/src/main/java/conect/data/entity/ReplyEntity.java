package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_post_num")
    @JsonIgnore
    private PostEntity postEntity;

    @ManyToOne
    @JoinColumn(name="reply_fk_user_renum")
    @JsonIgnore
    private UserEntity userEntity;
}