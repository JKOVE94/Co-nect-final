package conect.data.form;

import conect.data.entity.ReclikesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReclikesForm {
    private int reclike_pk_num; // 건의 좋아요 번호
    private int reclike_fk_user_num; // 사용자 엔티티 번호
    private int reclike_fk_rec_num; // 추천 엔티티 번호

    // Getters와 Setters

    public static ReclikesEntity fromEntity(ReclikesForm form) {
        ReclikesEntity entity = new ReclikesEntity();
        entity.setReclikePkNum(form.getReclike_pk_num());
        return entity;
    }
}

