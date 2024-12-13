package conect.data.form;

import java.time.LocalDate;

import conect.data.entity.NoticeEntity;
import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeForm {
	
	private Integer noti_pk_num;
	private String noti_name;
	private String noti_desc;
	private int noti_fk_user_num;
	private int noti_fk_proj_num;
	private LocalDate noti_regdate;
	
	//toEntity
	public static NoticeEntity toEntity(NoticeForm form) {
		NoticeEntity entity = new NoticeEntity();
        if (form.getNoti_pk_num() != null && form.getNoti_pk_num() != 0) {
            entity.setNotiPkNum(form.getNoti_pk_num());
        }
        entity.setNotiName(form.getNoti_name());
        entity.setNotiDesc(form.getNoti_desc());
        entity.setTaskStartdate(form.getTask_startdate());
        entity.setTaskDeadline(form.getTask_deadline());
        entity.setTaskEnddate(form.getTask_enddate());
        entity.setTaskDuration(form.getTask_duration());
        entity.setTaskProgress(form.getTask_progress());
        entity.setTaskStatus(form.getTask_status());
        entity.setTaskPriority(form.getTask_priority());
        entity.setTaskCreated(form.getTask_created());
        entity.setTaskUpdated(form.getTask_updated());
        entity.setTaskDepth(form.getTask_depth());
        entity.setTaskTag(form.getTask_tag());
        entity.setTaskTagcol(form.getTask_tagcol());
        if (form.getTask_fk_task_num() != null && form.getTask_fk_task_num() != 0) {
            entity.setTaskFkTaskNum(form.getTask_fk_task_num());
        }
        return entity;
    }
	
	
	
}
