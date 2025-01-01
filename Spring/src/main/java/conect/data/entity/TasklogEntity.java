package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "tasklog")
public class TasklogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tasklogPkNum; // 업무 로그 고유 식별자 [PK, INT, INCREMENT]
    private String tasklogContent; // 업무 로그 내용 [TEXT]

    @ManyToOne
    @JoinColumn(name = "tasklog_fk_task_num")
    private TaskEntity taskEntity;

    @OneToMany(mappedBy = "tasklogEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TaskhistoryEntity> taskhistoryEntities;

}
