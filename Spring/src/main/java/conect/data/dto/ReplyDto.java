package conect.data.dto;

import conect.data.entity.ReplyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyDto {
    private int reply_pk_num; //댓글 번호 [PK, INT]
    private String reply_cont; //댓글 내용 {TEXT]
    private int reply_fk_post_num; //게시글 번호 [FK, INT]
    private int reply_fk_proj_num; //프로젝트 번호
    private int reply_fk_user_renum; //댓글 작성자 사번 [FK, INT]

    public static ReplyDto fromEntity(ReplyEntity entity) {
        ReplyDto dto = new ReplyDto();
        dto.setReply_pk_num(entity.getReplyPkNum());
        dto.setReply_cont(entity.getReplyCont());
        dto.setReply_fk_user_renum(entity.getUserEntity().getUserPkNum());
        dto.setReply_fk_proj_num(entity.getProjectEntity().getProjPkNum());
        dto.setReply_fk_post_num(entity.getPostEntity().getPostFkPostNum());
        return dto;
    }
}