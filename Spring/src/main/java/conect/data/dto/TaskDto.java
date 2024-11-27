package conect.data.dto;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class TaskDto {
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
    private ProjectDto project_entity;
    private UserDto user_entity;
    private int task_fk_task_num;

    public static TaskDto fromEntity(TaskEntity entity) {
        TaskDto dto = new TaskDto();
        dto.setTask_pk_num(entity.getTaskPkNum());
        dto.setTask_title(entity.getTaskTitle());
        dto.setTask_desc(entity.getTaskDesc());
        dto.setTask_startdate(entity.getTaskStartDate());
        dto.setTask_deadline(entity.getTaskDeadline());
        dto.setTask_enddate(entity.getTaskEndDate());
        dto.setTask_duration(entity.getTaskDuration());
        dto.setTask_progress(entity.getTaskProgress());
        dto.setTask_status(entity.getTaskStatus());
        dto.setTask_priority(entity.getTaskPriority());
        dto.setTask_created(entity.getTaskCreated());
        dto.setTask_updated(entity.getTaskUpdated());
        dto.setTask_version(entity.getTaskVersion());
        dto.setProject_entity(ProjectDto.fromEntity(entity.getProjectEntity()));
        dto.setUser_entity(UserDto.fromEntity(entity.getUserEntity()));
        dto.setTask_fk_task_num(entity.getTaskFkTaskNum());
        return dto;
    }
}