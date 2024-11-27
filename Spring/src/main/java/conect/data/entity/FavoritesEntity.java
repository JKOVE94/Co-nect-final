package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "favorites")
public class FavoritesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int favorId;

    @ManyToOne
    @JoinColumn(name="favor_fk_post_num")
    private PostEntity postEntity;

    @ManyToOne
    @JoinColumn(name="favor_fk_proj_num")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name="favor_fk_user_num")
    private UserEntity userEntity;
}