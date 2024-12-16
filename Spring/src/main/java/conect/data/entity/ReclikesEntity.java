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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reclike_pk_num")
    private int reclikePkNum;  // 좋아요 고유 번호

    @ManyToOne
    @JoinColumn(name = "reclike_fk_rec_num")
    private RecommendationEntity recommendation;  // 좋아요한 건의사항

    @ManyToOne
    @JoinColumn(name = "reclike_fk_user_num")
    private UserEntity user;  // 좋아요 누른 사용자 

}