package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "share")
public class ShareEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sharePkNum; //공유 번호 [PK, INT]
    private int shareUser; //공유한 유저 번호 [INT]

    @ManyToOne
    @JoinColumn(name="share_fk_todo_num")
    private TodoEntity todoEntity;
}
