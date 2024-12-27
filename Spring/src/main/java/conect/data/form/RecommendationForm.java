package conect.data.form;

import conect.data.entity.RecommendationEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Setter
@Getter
public class RecommendationForm {
    private int rec_pk_num; // 건의 번호
    @NotNull
    private String rec_content; // 건의 내용
    @NotNull
    private String rec_title; // 건의 제목
    private LocalDateTime rec_regdate; // 건의 등록일
    private int rec_view; // 건의 조회수
    @NotNull
    private int rec_fk_user_num; // 사용자 엔티티 번호
    @NotNull
    private int rec_fk_proj_num; // 프로젝트 엔티티 번호

    // Getters와 Setters

    public static RecommendationEntity toEntity(RecommendationForm form) {
        RecommendationEntity entity = new RecommendationEntity();
        entity.setRecPkNum(form.getRec_pk_num());
        entity.setRecContent(form.getRec_content());
        entity.setRecTitle(form.getRec_title());
        entity.setRecRegdate(form.getRec_regdate());
        entity.setRecView(form.getRec_view());
        return entity;
    }
}
