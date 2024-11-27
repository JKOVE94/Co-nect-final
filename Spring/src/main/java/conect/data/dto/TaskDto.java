package conect.data.dto;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class TaskDto {
    private int task_pk_num; //업무 고유 식별자 [PK, INT, INCREMENT]
    private String task_title; //업무 제목 [VARCHAR]
    private String task_desc; //업무 설명 {TEXT]
    private Date task_startdate; //업무 시작일 {DATETIME]
    private Date task_deadline; //마감 기한일 [DATETIME]
    private Date task_enddate; //업무 종료일 [DATETIME]
    private int task_duration; //업무 기간 (일 단위) [INT]
    private int task_progress; //진행률 (%) [INT]
    private String task_status; //업무 상태 [VARCHAR] (예정, 진행중, 완료)
    private int task_priority; //우선순위 [INT]
    private Date task_created; //업무 생성 일시 [DATETIME]
    private Date task_updated; //업무 정보 최종 수정 일시 [DATETIME]
    private double task_version; //업무 버전 번호 [FLOAT]
    private int task_depth;
    private String task_tag;
    private String task_tagcol;
    private int task_fk_user_num; //담당자 사번 [FK, INT]
    private int task_fk_proj_num; //연관된 프로젝트 번호 [FK, INT]
    private int task_fk_task_num; //상위 업무 번호 [FK, INT]

    public static TaskDto fromEntity(TaskEntity entity) {
        TaskDto dto = new TaskDto();
        dto.setTask_pk_num(entity.getTaskPkNum());
        dto.setTask_title(entity.getTaskTitle());
        dto.setTask_desc(entity.getTaskDesc());
        dto.setTask_startdate(entity.getTaskStartdate());
        dto.setTask_deadline(entity.getTaskDeadline());
        dto.setTask_enddate(entity.getTaskEnddate());
        dto.setTask_duration(entity.getTaskDuration());
        dto.setTask_progress(entity.getTaskProgress());
        dto.setTask_status(entity.getTaskStatus());
        dto.setTask_priority(entity.getTaskPriority());
        dto.setTask_created(entity.getTaskCreated());
        dto.setTask_updated(entity.getTaskUpdated());
        dto.setTask_version(entity.getTaskVersion());
        dto.setTask_fk_task_num(entity.getTaskFkTaskNum());
        dto.setTask_depth(entity.getTaskDepth());
        dto.setTask_tag(entity.getTaskTag());
        dto.setTask_tagcol(entity.getTaskTagcol());
        dto.setTask_fk_user_num(entity.getUserEntity().getUserPkNum());
        dto.setTask_fk_proj_num(entity.getProjectEntity().getProjPkNum());
        return dto;
    }
}