package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
@Table(name="task")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskPkNum; //업무 고유 식별자 [PK, INT, INCREMENT]
    private String taskTitle; //업무 제목 [VARCHAR]
    private String taskDesc; //업무 설명 {TEXT]
    private Date taskStartdate; //업무 시작일 {DATETIME]
    private Date taskDeadline; //마감 기한일 [DATETIME]
    private Date taskEnddate; //업무 종료일 [DATETIME]
    private int taskDuration; //업무 기간 (일 단위) [INT]
    private int taskProgress; //진행률 (%) [INT]
    private String taskStatus; //업무 상태 [VARCHAR] (예정, 진행중, 완료)
    private int taskPriority; //우선순위 [INT]
    private Date taskCreated; //업무 생성 일시 [DATETIME]
    private Date taskUpdated; //업무 정보 최종 수정 일시 [DATETIME]
    private double taskVersion; //업무 버전 번호 [FLOAT]
    private int taskDepth;
    private String taskTag;
    private String taskTagcol;
    private int taskFkTaskNum;

    @ManyToOne
    @JoinColumn(name="task_fk_proj_num")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name="task_fk_user_num")
    private UserEntity userEntity;
}