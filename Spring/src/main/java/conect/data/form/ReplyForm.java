package conect.data.form;

import conect.data.entity.ReplyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyForm {
    private int reply_pk_num; //댓글 번호 [PK, INT]
    private String reply_cont; //댓글 내용 {TEXT]
    private int reply_fk_post_num; //게시글 번호 [FK, INT]
    private int reply_fk_proj_num; //프로젝트 번호
    private int reply_fk_user_renum; //댓글 작성자 사번 [FK, INT]

    public static ReplyEntity toEntity(ReplyForm form) {
        //fk관련된 데이터는 servie단에서 findById로 찾아야 함
        ReplyEntity entity = new ReplyEntity();
        entity.setReplyPkNum(form.getReply_pk_num());
        entity.setReplyCont(form.getReply_cont());
        return entity;
    }
}