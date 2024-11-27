package conect.data.form;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TaskForm {
    private int task_pk_num;
    private String task_title;
    private String task_desc;
    private Date task_startdate;
    private Date task_deadline;
    private Date task_enddate;
    private int task_duration;
    private int task_progress;
    private String task_status;
    private int task_priority;
    private Date task_created;
    private Date task_updated;
    private double task_version;

    public TaskEntity toEntity() {
        TaskEntity entity = new TaskEntity();
        entity.setTaskPkNum(this.task_pk_num);
        entity.setTaskTitle(this.task_title);
        entity.setTaskDesc(this.task_desc);
        entity.setTaskStartDate(this.task_startdate);
        entity.setTaskDeadline(this.task_deadline);
        entity.setTaskEndDate(this.task_enddate);
        entity.setTaskDuration(this.task_duration);
        entity.setTaskProgress(this.task_progress);
        entity.setTaskStatus(this.task_status);
        entity.setTaskPriority(this.task_priority);
        entity.setTaskCreated(this.task_created);
        entity.setTaskUpdated(this.task_updated);
        entity.setTaskVersion(this.task_version);
        return entity;
    }
}