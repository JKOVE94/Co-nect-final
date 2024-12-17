package conect.data.form;

import conect.data.entity.ReplyLikesEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReplyLikesForm {
    private int replylike_pk_num; // 댓글 좋아요 번호
    private int user_fk_num; // 사용자 엔티티 번호
    private int reply_fk_num; // 댓글 엔티티 번호
    
    public static ReplyLikesEntity toEntity(ReplyLikesForm form) {
        ReplyLikesEntity entity = new ReplyLikesEntity();
        entity.setReplylikePkNum(form.getReplylike_pk_num());
        return entity;
    }
}