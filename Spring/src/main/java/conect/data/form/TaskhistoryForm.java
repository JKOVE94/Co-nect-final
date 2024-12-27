package conect.data.form;

import conect.data.entity.TaskhistoryEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskhistoryForm {
    private int taskhistory_pk_num; // 업무 이력 고유 식별자 [PK, INT, INCREMENT]
    private String taskhis_beforevalue; // 업무 이력 변경 전 값 [VARCHAR]
    private String taskhis_aftervalue; // 업무 이력 변경 후 값 [VARCHAR]
    private String taskhis_type; // 업무 이력 유형 [VARCHAR]
    private LocalDateTime taskhis_updated; // 업무 이력 정보 최종 수정 일시 [DATETIME]
    private int taskhistory_fk_task_num;
    private int taskhistory_fk_user_num;
    private int taskhistory_fk_comp_num;
    private int taskhistory_fk_tasklog_num;

    public static TaskhistoryEntity toEntity(TaskhistoryForm form) {
        TaskhistoryEntity entity = new TaskhistoryEntity();
        entity.setTaskhistoryPkNum(form.getTaskhistory_pk_num());
        entity.setTaskhisBeforevalue(form.getTaskhis_beforevalue());
        entity.setTaskhisAftervalue(form.getTaskhis_aftervalue());
        entity.setTaskhisType(form.getTaskhis_type());
        entity.setTaskhisUpdated(form.getTaskhis_updated());
        return entity;
    }
}