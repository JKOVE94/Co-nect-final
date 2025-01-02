package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    private LocalDate todoStartdate; //투두리스트 시작일 [DATETIME]
    private LocalDate todoEnddate; //투두리스트 종료일 [DATETIME]
    private LocalTime todoStarttime; //투두리스트 시작시간 [DATETIME]
    private LocalTime todoEndtime; //투두리스트 종료시간 [DATETIME]
    private String todoCategory; //투두리스트 카테고리 [VARCHAR]

    @ManyToOne
    @JoinColumn(name = "todo_fk_user_num")
    @JsonIgnore
    private UserEntity userEntity;
    
    @OneToMany(mappedBy = "todoEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ShareEntity> shareEntities;

}