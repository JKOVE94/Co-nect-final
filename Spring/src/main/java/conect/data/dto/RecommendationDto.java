package conect.data.dto;

import conect.data.entity.RecommendationEntity;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Setter
@Getter
public class RecommendationDto {
    private int rec_pk_num; // 건의 번호
    private String rec_content; // 건의 내용
    private String rec_title; // 건의 제목
    private LocalDateTime rec_regdate; // 건의 등록일
    private int rec_view; // 건의 조회수
    private int rec_fk_user_num; // 사용자 엔티티 번호
    private int rec_fk_proj_num; // 프로젝트 엔티티 번호
    private Integer rec_likes; // 건의사항 좋아요 수
    private Integer reply; // 건의사항 댓글 수

    // Getters와 Setters

    public static RecommendationDto fromEntity(RecommendationEntity recommendationEntity) {
        RecommendationDto recommendationDto = new RecommendationDto();
        recommendationDto.setRec_pk_num(recommendationEntity.getRecPkNum());
        recommendationDto.setRec_content(recommendationEntity.getRecContent());
        recommendationDto.setRec_title(recommendationEntity.getRecTitle());
        recommendationDto.setRec_regdate(recommendationEntity.getRecRegdate());
        recommendationDto.setRec_view(recommendationEntity.getRecView());

        // 사용자 엔티티 및 프로젝트 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
        if (recommendationEntity.getUserEntity() != null) {
            recommendationDto.setRec_fk_user_num(recommendationEntity.getUserEntity().getUserPkNum()); // 예시: 사용자 엔티티의 PK 값으로 수정
        }
        if (recommendationEntity.getProjectEntity() != null) {
            recommendationDto.setRec_fk_proj_num(recommendationEntity.getProjectEntity().getProjPkNum()); // 예시: 프로젝트 엔티티의 PK 값으로 수정
        }
        recommendationDto.setRec_likes(recommendationEntity.getReclikesEntities().size());
        recommendationDto.setReply(recommendationEntity.getReplyEntities().size());

        return recommendationDto;
    }

    // Getters와 Setters 생략 (필요 시 추가하세요)
}
