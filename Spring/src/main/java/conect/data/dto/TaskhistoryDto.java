package conect.data.dto;

import conect.data.entity.TaskhistoryEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskhistoryDto {
    private int taskhistory_pk_num; // 업무 이력 고유 식별자 [PK, INT, INCREMENT]
    private String taskhis_beforevalue; // 업무 이력 변경 전 값 [VARCHAR]
    private String taskhis_aftervalue; // 업무 이력 변경 후 값 [VARCHAR]
    private String taskhis_type; // 업무 이력 유형 [VARCHAR]
    private LocalDateTime taskhis_updated; // 업무 이력 정보 최종 수정 일시 [DATETIME]
    private int taskhistory_fk_task_num;
    private int taskhistory_fk_user_num;
    private int taskhistory_fk_comp_num;
    private int taskhistory_fk_tasklog_num;

    public static TaskhistoryDto fromEntity(TaskhistoryEntity entity) {
        TaskhistoryDto dto = new TaskhistoryDto();
        dto.setTaskhistory_pk_num(entity.getTaskhistoryPkNum());
        dto.setTaskhis_beforevalue(entity.getTaskhisBeforevalue());
        dto.setTaskhis_aftervalue(entity.getTaskhisAftervalue());
        dto.setTaskhis_type(entity.getTaskhisType());
        dto.setTaskhis_updated(entity.getTaskhisUpdated());
        dto.setTaskhistory_fk_task_num(entity.getTaskEntity().getTaskPkNum());
        dto.setTaskhistory_fk_user_num(entity.getUserEntity().getUserPkNum());
        dto.setTaskhistory_fk_comp_num(entity.getCompanyEntity().getCompPkNum());
        dto.setTaskhistory_fk_tasklog_num(entity.getTasklogEntity().getTasklogPkNum());
        return dto;
    }
}