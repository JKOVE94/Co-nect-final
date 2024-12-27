package conect.data.form;

import conect.data.entity.TasklogEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TasklogForm {

    private int tasklog_pk_num; // 업무 로그 고유 식별자 [PK, INT, INCREMENT]
    private String tasklog_content; // 업무 로그 내용 [TEXT]
    private int tasklog_fk_task_num;

    public static TasklogEntity toEntity(TasklogForm form) {
        TasklogEntity entity = new TasklogEntity();
        entity.setTasklogPkNum(form.getTasklog_pk_num());
        entity.setTasklogContent(form.getTasklog_content());
        return entity;
    }
}