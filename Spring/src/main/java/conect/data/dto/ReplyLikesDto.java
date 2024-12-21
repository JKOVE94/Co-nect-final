package conect.data.dto;

import conect.data.entity.ReplyLikesEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReplyLikesDto {
    private int replylike_pk_num; // 댓글 좋아요 번호
    private int user_fk_num; // 사용자 엔티티 번호
    private int reply_fk_num; // 댓글 엔티티 번호


    public static ReplyLikesDto fromEntity(ReplyLikesEntity replyLikesEntity) {
        ReplyLikesDto replyLikesDto = new ReplyLikesDto();
        replyLikesDto.setReplylike_pk_num(replyLikesEntity.getReplylikePkNum());

        // 사용자 엔티티 및 댓글 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
        if (replyLikesEntity.getUserEntity() != null) {
            replyLikesDto.setUser_fk_num(replyLikesEntity.getUserEntity().getUserPkNum()); // 예시: 사용자 엔티티의 PK 값으로 수정
        }
        if (replyLikesEntity.getReplyEntity() != null) {
            replyLikesDto.setReply_fk_num(replyLikesEntity.getReplyEntity().getReplyPkNum()); // 예시: 댓글 엔티티의 PK 값으로 수정
        }
        return replyLikesDto;
    }
}