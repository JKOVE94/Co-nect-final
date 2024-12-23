package conect.data.form;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskForm {
    private Integer taskPkNum;
    private String taskTitle;
    private String taskContent;
    private LocalDate taskStartdate;
    private LocalDate taskDeadline;
    private Integer taskDuration;
    private Integer taskProgress;
    private String taskStatus;
    private String taskPriority;
    private LocalDate taskCreated;
    private Integer taskDepth;
    private Integer taskGroup;
    private String taskTagcol;
    private Integer taskFkUserNum;
    private Integer taskFkProjNum;

    public static TaskEntity toEntity(TaskForm form) {
        TaskEntity entity = new TaskEntity();
        if (form.getTaskPkNum() != null && form.getTaskPkNum() != 0) {
            entity.setTaskPkNum(form.getTaskPkNum());
        }
        entity.setTaskTitle(form.getTaskTitle());
        entity.setTaskContent(form.getTaskContent());
        entity.setTaskStartdate(form.getTaskStartdate());
        entity.setTaskDeadline(form.getTaskDeadline());
        entity.setTaskDuration(form.getTaskDuration());
        entity.setTaskProgress(form.getTaskProgress());
        entity.setTaskStatus(form.getTaskStatus());
        entity.setTaskPriority(form.getTaskPriority());
        entity.setTaskCreated(form.getTaskCreated());
        entity.setTaskDepth(form.getTaskDepth());
        entity.setTaskGroup(form.getTaskGroup());
        entity.setTaskTagcol(form.getTaskTagcol());
        return entity;
    }
}
