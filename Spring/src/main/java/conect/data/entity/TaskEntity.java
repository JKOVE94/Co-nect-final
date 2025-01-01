package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "task")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskPkNum; // 업무 고유 식별자 [PK, INT, INCREMENT]

    @Column(name = "task_title", nullable = false)
    private String taskTitle;

    @Column(name = "task_content", columnDefinition = "TEXT")
    private String taskContent;

    @Column(name = "task_startdate")
    private LocalDate taskStartdate;

    @Column(name = "task_deadline")
    private LocalDate taskDeadline;

    @Column(name = "task_duration")
    private Integer taskDuration;

    @Column(name = "task_progress")
    private Integer taskProgress;

    @Column(name = "task_status")
    private String taskStatus;

    @Column(name = "task_priority")
    private String taskPriority;

    @Column(name = "task_created")
    private LocalDate taskCreated;

    @Column(name = "task_depth")
    private Integer taskDepth;

    @Column(name = "task_group")
    private Integer taskGroup;

    @Column(name = "task_tagcol")
    private String taskTagcol;

    @ManyToOne
    @JoinColumn(name = "task_fk_proj_num")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name = "task_fk_user_num")
    private UserEntity userEntity;

    @OneToMany(mappedBy = "taskEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TaskhistoryEntity> taskhistoryEntities;

    @OneToMany(mappedBy = "taskEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TasklogEntity> tasklogEntities;
}
