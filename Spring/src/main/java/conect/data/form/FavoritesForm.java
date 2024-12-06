package conect.data.form;

import conect.data.entity.FavoritesEntity;
import conect.data.repository.PostRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

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