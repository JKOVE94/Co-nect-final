package conect.data.form;

import conect.data.entity.TaskEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TaskForm {
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

    public static TaskEntity toEntity(TaskForm form) {
        //fk관련된 데이터는 servie단에서 findById로 찾아야 함
        TaskEntity entity = new TaskEntity();
        entity.setTaskPkNum(form.getTask_pk_num());
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
        entity.setTaskVersion(form.getTask_version());
        entity.setTaskDepth(form.getTask_depth());
        entity.setTaskTag(form.getTask_tag());
        entity.setTaskTagcol(form.getTask_tagcol());
        return entity;
    }
}