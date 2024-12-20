package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "reclikes")
public class ReclikesEntity {
    @Id
    private int reclikesPkNum; //건의 좋아요 번호 [PK, INT]

    @ManyToOne
    @JoinColumn(name = "reclikes_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "reclikes_fk_rec_num")
    private RecommendationEntity recommendationEntity;
}
