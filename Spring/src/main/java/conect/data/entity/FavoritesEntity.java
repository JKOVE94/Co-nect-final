package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private PostEntity postEntity;

    @ManyToOne
    @JoinColumn(name="favor_fk_proj_num")
    @JsonIgnore
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name="favor_fk_user_num")
    @JsonIgnore
    private UserEntity userEntity;
}