package conect.data.dto;

import conect.data.entity.ProjectEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProjectDto {
    private int proj_pk_num; // 프로젝트 번호
    private String proj_title; // 프로젝트 이름
    private String proj_content; // 프로젝트 설명
    private LocalDate proj_startdate; // 프로젝트 시작일
    private LocalDate proj_enddate; // 프로젝트 종료일
    private String proj_status; // 프로젝트 상태
    private LocalDate proj_created; // 프로젝트 등록일
    private LocalDate proj_updated; // 프로젝트 정보 최종 수정 일시
    private int proj_fk_user_num; // 프로젝트 담당자
    private String proj_manager; // 프로젝트 매니저
    private int proj_fk_comp_num; // 회사 엔티티 번호
    private List<ProjectmemberDto> memberDtoList; // 프로젝트 멤버 리스트

    public static ProjectDto fromEntity(ProjectEntity projectEntity) {
        ProjectDto projectDto = new ProjectDto();
        projectDto.setProj_pk_num(projectEntity.getProjPkNum());
        projectDto.setProj_title(projectEntity.getProjTitle());
        projectDto.setProj_content(projectEntity.getProjContent());
        projectDto.setProj_startdate(projectEntity.getProjStartdate());
        projectDto.setProj_enddate(projectEntity.getProjEnddate());
        projectDto.setProj_status(projectEntity.getProjStatus());
        projectDto.setProj_updated(projectEntity.getProjUpdated());
        projectDto.setProj_created(projectEntity.getProjCreated());
        projectDto.setProj_manager(projectEntity.getUserEntity().getUserName());
        projectDto.setProj_fk_user_num(projectEntity.getUserEntity().getUserPkNum());
        projectDto.setProj_fk_comp_num(projectEntity.getCompanyEntity().getCompPkNum());
        projectDto.setMemberDtoList(projectEntity.getProjectmemberEntities().stream().map(ProjectmemberDto::fromEntity).toList());
        return projectDto;
    }
}
