package conect.data.dto;

import conect.data.entity.ProjectEntity;
import conect.data.entity.TaskEntity;
import conect.data.entity.UserEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskDto {
    private int taskPkNum;
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
    private String userName; // 담당자 이름
    private Integer taskFkProjNum;

    public static TaskDto fromEntity(TaskEntity entity) {
        TaskDto dto = new TaskDto();
        dto.setTaskPkNum(entity.getTaskPkNum());
        dto.setTaskTitle(entity.getTaskTitle());
        dto.setTaskContent(entity.getTaskContent());
        dto.setTaskStartdate(entity.getTaskStartdate());
        dto.setTaskDeadline(entity.getTaskDeadline());
        dto.setTaskDuration(entity.getTaskDuration());
        dto.setTaskProgress(entity.getTaskProgress());
        dto.setTaskStatus(entity.getTaskStatus());
        dto.setTaskPriority(entity.getTaskPriority());
        dto.setTaskCreated(entity.getTaskCreated());
        dto.setTaskDepth(entity.getTaskDepth());
        dto.setTaskGroup(entity.getTaskGroup());
        dto.setTaskTagcol(entity.getTaskTagcol());

        if (entity.getUserEntity() != null) {
            dto.setTaskFkUserNum(entity.getUserEntity().getUserPkNum());
            dto.setUserName(entity.getUserEntity().getUserName());
        }

        if (entity.getProjectEntity() != null) {
            dto.setTaskFkProjNum(entity.getProjectEntity().getProjPkNum());
        }

        return dto;
    }
}
