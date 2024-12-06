package conect.data.form;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class TaskForm {
    private Integer task_pk_num; //업무 고유 식별자 [PK, INT, INCREMENT]
    private String task_title; //업무 제목 [VARCHAR]
    private String task_desc; //업무 설명 {TEXT]
    private LocalDate task_startdate; //업무 시작일 {DATETIME]
    private LocalDate task_deadline; //마감 기한일 [DATETIME]
    private LocalDate task_enddate; //업무 종료일 [DATETIME]
    private int task_duration; //업무 기간 (일 단위) [INT]
    private int task_progress; //진행률 (%) [INT]
    private String task_status; //업무 상태 [VARCHAR] (예정, 진행중, 완료)
    private int task_priority; //우선순위 [INT]
    private LocalDate task_created; //업무 생성 일시 [DATETIME]
    private LocalDate task_updated; //업무 정보 최종 수정 일시 [DATETIME]
    private int task_depth;
    private String task_tag;
    private String task_tagcol;
    private int task_fk_user_num; //담당자 사번 [FK, INT]
    private int task_fk_proj_num; //연관된 프로젝트 번호 [FK, INT]
    private Integer task_fk_task_num; //상위 업무 번호 [FK, INT]

    public static TaskEntity toEntity(TaskForm form) {
        TaskEntity entity = new TaskEntity();
        if (form.getTask_pk_num() != null && form.getTask_pk_num() != 0) {
            entity.setTaskPkNum(form.getTask_pk_num());
        }
        entity.setTaskTitle(form.getTask_title());
        entity.setTaskDesc(form.getTask_desc());
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