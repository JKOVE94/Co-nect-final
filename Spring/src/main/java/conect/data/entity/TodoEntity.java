package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "todo")
public class TodoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int todoPkNum; //투두리스트 고유 식별자 [PK, INT, INCREMENT]
    private String todoTitle; // 투두리스트 제목 [VARCHAR]
    private String todoContent; //투두리스트 내용 [VARCHAR]
    private Date todoStart; //투두리스트 시작일 [DATETIME]
    private Date todoEnd; //투두리스트 종료일 [DATETIME]
    private int todoIcon;
    private String todoTagcol;

    @ManyToOne
    @JoinColumn(name = "todo_fk_user_num")
    private UserEntity user;
}