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
    private String taskTagcol; // 업무 태그 [VARCHAR]
    private String taskPriority; // 우선순위 [ENUM] (낮음, 보통, 높음)
    private int taskFkProjNum;
    private int taskFkUserNum;

    public static TaskEntity toEntity(TaskForm form) {
        TaskEntity entity = new TaskEntity();
        entity.setTaskPkNum(form.getTaskPkNum());
        entity.setTaskTitle(form.getTaskTitle());
        entity.setTaskContent(form.getTaskContent());
        entity.setTaskStartdate(form.getTaskStartdate());
        entity.setTaskDeadline(form.getTaskDeadline());
        entity.setTaskDuration(form.getTaskDuration());
        entity.setTaskProgress(form.getTaskProgress());
        entity.setTaskStatus(form.getTaskStatus());
        entity.setTaskCreated(form.getTaskCreated());
        entity.setTaskDepth(form.getTaskDepth());
        entity.setTaskGroup(form.getTaskGroup());
        entity.setTaskTagcol(form.getTaskTagcol());
        entity.setTaskPriority(form.getTaskPriority());
        return entity;
    }
}