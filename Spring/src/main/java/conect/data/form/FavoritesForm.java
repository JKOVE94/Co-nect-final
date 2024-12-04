package conect.data.form;

import conect.data.entity.FavoritesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoritesForm {
    private int favor_id;
    private int favor_fk_user_num;
    private int favor_fk_post_num;
    private int favor_fk_proj_num;

    public static FavoritesEntity toEntity(FavoritesForm form) {
        //나머지 정보는 Service 단에서 findById로 처리해야함
        FavoritesEntity entity = new FavoritesEntity();
        entity.setFavorId(form.getFavor_id());
        return entity;
    }
}