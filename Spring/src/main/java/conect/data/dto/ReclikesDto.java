package conect.data.dto;

import conect.data.entity.ReclikesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReclikesDto {
    private int reclike_pk_num; // 건의 좋아요 번호
    private int reclike_fk_user_num; // 사용자 엔티티 번호(사번)
    private int reclike_fk_rec_num; //	건의사항 엔티티 번호

    // Getters와 Setters

    public static ReclikesDto fromEntity(ReclikesEntity reclikesEntity) {
        ReclikesDto reclikesDto = new ReclikesDto();
        reclikesDto.setReclike_pk_num(reclikesEntity.getReclikePkNum());

        // 사용자 엔티티 및 추천 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
        if (reclikesEntity.getUserEntity() != null) {
            reclikesDto.setReclike_fk_user_num(reclikesEntity.getUserEntity().getUserPkNum()); // 예시: 사용자 엔티티의 PK 값으로 수정
        }
        if (reclikesEntity.getRecommendationEntity() != null) {
            reclikesDto.setReclike_fk_rec_num(reclikesEntity.getRecommendationEntity().getRecPkNum()); // 예시: 추천 엔티티의 PK 값으로 수정
        }

        return reclikesDto;
    }

    // Getters와 Setters 생략 (필요 시 추가하세요)
}

