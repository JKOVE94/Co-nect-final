package conect.data.form;

import conect.data.entity.FavoritesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoritesForm {
    private int favor_id;

    public FavoritesEntity toEntity() {
        FavoritesEntity entity = new FavoritesEntity();
        entity.setFavorId(this.favor_id);
        return entity;
    }
}