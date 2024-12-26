package conect.data.form;

import conect.data.dto.ReplyDto;
import conect.data.entity.ReplyEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Getter
@Setter
public class ReplyForm {
    private int reply_pk_num; // 댓글 번호
    @NotNull
    private String reply_content; // 댓글 내용
    private int reply_parent; // 댓글과 대댓글이 속한 그룹
    private LocalDateTime reply_regdate; // 댓글 등록일
    @NotNull
    private int reply_depth; // 댓글의 깊이
    @NotNull
    private int reply_fk_user_num; // 사용자 엔티티 번호
    @NotNull
    private int reply_fk_rec_num; // 추천 엔티티 번호

    // Getters and Setters

    public static ReplyEntity toEntity(ReplyForm form) {
        ReplyEntity entity = new ReplyEntity();
        entity.setReplyPkNum(form.getReply_pk_num());
        entity.setReplyContent(form.getReply_content());
        entity.setReplyParent(form.getReply_parent());
        entity.setReplyRegdate(form.getReply_regdate());
        entity.setReplyDepth(form.getReply_depth());
        return entity;
    }
}