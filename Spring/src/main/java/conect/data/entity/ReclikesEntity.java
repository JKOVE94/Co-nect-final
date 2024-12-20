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
    private int reclikePkNum; //건의 좋아요 번호 [PK, INT]

    @ManyToOne
    @JoinColumn(name = "reclike_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "reclike_fk_rec_num")
    private RecommendationEntity recommendationEntity;
}


