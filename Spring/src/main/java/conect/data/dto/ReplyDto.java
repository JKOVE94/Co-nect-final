package conect.data.dto;

import conect.data.entity.ReplyEntity;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Getter
@Setter
public class ReplyDto {
    private int reply_pk_num; // 댓글 번호
    private String reply_content; // 댓글 내용
    private int reply_parent; // 댓글과 대댓글이 속한 그룹
    private LocalDateTime reply_regdate; // 댓글 등록일
    private int reply_depth; // 댓글의 깊이
    private int reply_fk_user_num; // 사용자 엔티티 번호
    private int reply_fk_rec_num; // 추천 엔티티 번호
    private Integer reply_likes; // 댓글 좋아요 수


    // Getters and Setters

    public static ReplyDto fromEntity(ReplyEntity replyEntity) {
        ReplyDto replyDto = new ReplyDto();
        replyDto.setReply_pk_num(replyEntity.getReplyPkNum());
        replyDto.setReply_content(replyEntity.getReplyContent());
        replyDto.setReply_parent(replyEntity.getReplyParent());
        replyDto.setReply_regdate(replyEntity.getReplyRegdate());
        replyDto.setReply_depth(replyEntity.getReplyDepth());

        if (replyEntity.getRecommendationEntity() != null) {
            replyDto.setReply_fk_rec_num(replyEntity.getRecommendationEntity().getRecPkNum()); // 예시: 추천 엔티티의 PK 값으로 수정
        }
        if (replyEntity.getUserEntity() != null) {
            replyDto.setReply_fk_user_num(replyEntity.getUserEntity().getUserPkNum()); // 예시: 사용자 엔티티의 PK 값으로 수정
        }
        replyDto.setReply_likes(replyEntity.getReplylikesEntities().size());

        return replyDto;
    }
}
