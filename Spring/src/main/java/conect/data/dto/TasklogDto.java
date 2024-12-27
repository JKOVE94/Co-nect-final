package conect.data.dto;

import conect.data.entity.TasklogEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TasklogDto {

    private int tasklog_pk_num; // 업무 로그 고유 식별자 [PK, INT, INCREMENT]
    private String tasklog_content; // 업무 로그 내용 [TEXT]
    private int tasklog_fk_task_num;

    public static TasklogDto fromEntity(TasklogEntity entity) {
        TasklogDto dto = new TasklogDto();
        dto.setTasklog_pk_num(entity.getTasklogPkNum());
        dto.setTasklog_content(entity.getTasklogContent());
        dto.setTasklog_fk_task_num(entity.getTaskEntity().getTaskPkNum());
        return dto;
    }
}