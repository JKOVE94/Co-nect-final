package conect.data.form;

import conect.data.entity.ProjectEntity;
import conect.data.entity.TaskEntity;
import conect.data.entity.UserEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class TaskForm {
    private int task_pk_num; // 업무 고유 식별자 [PK, INT, INCREMENT]
    private String task_title; // 업무 제목 [VARCHAR]
    private String task_content; // 업무 설명 {TEXT]
    private LocalDate task_startdate; // 업무 시작일 {DATETIME]
    private LocalDate task_deadline; // 마감 기한일 [DATETIME]
    private int task_duration; // 업무 기간 (일 단위) [INT]
    private int task_progress; // 진행률 (%) [INT]
    private String task_status; // 업무 상태 [VARCHAR] (예정, 진행중, 완료)
    private LocalDate task_created; // 업무 생성 일시 [DATETIME]
    private int task_depth; // 업무 계층 [INT]
    private int task_group; // 업무 그룹 [INT] => 상위 업무와 하위업무의 그릅 => 상위업무의 pkNum
    private String task_color; // 업무 태그 [VARCHAR]
    private String task_priority; // 우선순위 [ENUM] (낮음, 보통, 높음)
    private int task_fk_proj_num;
    private int task_fk_user_num;

    public static TaskEntity toEntity(TaskForm form) {
        TaskEntity entity = new TaskEntity();
        entity.setTaskPkNum(form.getTask_pk_num());
        entity.setTaskTitle(form.getTask_title());
        entity.setTaskContent(form.getTask_content());
        entity.setTaskStartdate(form.getTask_startdate());
        entity.setTaskDeadline(form.getTask_deadline());
        entity.setTaskDuration(form.getTask_duration());
        entity.setTaskProgress(form.getTask_progress());
        entity.setTaskStatus(form.getTask_status());
        entity.setTaskCreated(form.getTask_created());
        entity.setTaskDepth(form.getTask_depth());
        entity.setTaskGroup(form.getTask_group());
        entity.setTaskTagcol(form.getTask_color());
        entity.setTaskPriority(form.getTask_priority());
        return entity;
    }
}