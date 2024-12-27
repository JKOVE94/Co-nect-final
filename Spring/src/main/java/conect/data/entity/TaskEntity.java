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
    private String taskTitle; // 업무 제목 [VARCHAR]
    private String taskContent; // 업무 설명 {TEXT]
    private LocalDate taskStartdate; // 업무 시작일 {DATETIME]
    private LocalDate taskDeadline; // 마감 기한일 [DATETIME]
    private int taskDuration; // 업무 기간 (일 단위) [INT]
    private int taskProgress; // 진행률 (%) [INT]
    private String taskStatus; // 업무 상태 [VARCHAR] (예정, 진행중, 완료)
    private LocalDate taskCreated; // 업무 생성 일시 [DATETIME]
    private int taskDepth; // 업무 계층 [INT]
    private int taskGroup; // 업무 그룹 [INT] => 상위 업무와 하위업무의 그릅 => 상위업무의 pkNum
    private String taskColor; // 업무 태그 [VARCHAR]
    private String taskPriority; // 우선순위 [ENUM] (낮음, 보통, 높음)

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
    @JoinColumn(name = "task_fk_user_num")
    private UserEntity userEntity;

    @OneToMany(mappedBy = "taskEntity", orphanRemoval = true)
    private List<TaskhistoryEntity> taskhistoryEntities;

    @OneToMany(mappedBy = "taskEntity", orphanRemoval = true)
    private List<TasklogEntity> tasklogEntities;
}
