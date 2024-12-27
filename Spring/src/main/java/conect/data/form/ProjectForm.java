package conect.data.form;

import conect.data.entity.ProjectEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class ProjectForm {
    private int proj_pk_num; // 프로젝트 번호
    private String proj_title; // 프로젝트 이름
    private String proj_content; // 프로젝트 설명
    private LocalDate proj_startdate; // 프로젝트 시작일
    private LocalDate proj_enddate; // 프로젝트 종료일
    private String proj_status; // 프로젝트 상태
    private LocalDate proj_created; // 프로젝트 등록일
    private LocalDate proj_updated; // 프로젝트 정보 최종 수정 일시
    private int proj_fk_comp_num; // 회사 엔티티 번호
    private int proj_fk_user_num; // 사용자 엔티티 번호

    public static ProjectEntity toEntity(ProjectForm form) {
        ProjectEntity entity = new ProjectEntity();
        entity.setProjPkNum(form.getProj_pk_num());
        entity.setProjTitle(form.getProj_title());
        entity.setProjContent(form.getProj_content());
        entity.setProjStartdate(form.getProj_startdate());
        entity.setProjEnddate(form.getProj_enddate());
        entity.setProjStatus(form.getProj_status());
        entity.setProjCreated(form.getProj_created());
        entity.setProjUpdated(form.getProj_updated());
        return entity;
    }
}