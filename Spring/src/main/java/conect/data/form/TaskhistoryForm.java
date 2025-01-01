package conect.data.form;

import conect.data.entity.TaskhistoryEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskhistoryForm {

    private String taskhis_beforevalue;
    private String taskhis_aftervalue;
    private LocalDateTime taskhis_updated;
    private String taskhis_type;
    private int taskhis_fk_comp_num;
    private int taskhis_fk_user_num;
    private int taskhis_fk_task_num;

    public static TaskhistoryEntity toEntity(TaskhistoryForm form) {
        TaskhistoryEntity entity = new TaskhistoryEntity();
        entity.setTaskhisBeforevalue(form.getTaskhis_beforevalue());
        entity.setTaskhisAftervalue(form.getTaskhis_aftervalue());
        entity.setTaskhisUpdated(form.getTaskhis_updated());
        entity.setTaskhisType(form.getTaskhis_type());
        return entity;
    }
}
