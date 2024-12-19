package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "recommendation")
public class RecommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recPkNum; //건의 번호 [PK, INT]
    private String recContent; //건의 내용 [TEXT]
    private String recTitle; //건의 제목 [VARCHAR]
    private LocalDateTime recRegdate; //건의 등록일 [DATETIME]
    private int recView; //건의 조회수 [INT]

    @ManyToOne
    @JoinColumn(name = "rec_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "rec_fk_proj_num")
    private ProjectEntity projectEntity;
    
    @OneToMany(mappedBy = "recommendationEntity")
    List<ReclikesEntity> reclikesEntities;
}
