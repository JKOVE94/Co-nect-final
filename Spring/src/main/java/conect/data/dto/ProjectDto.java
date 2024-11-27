package conect.data.dto;

import conect.data.entity.ProjectEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class ProjectDto {
    private int proj_pk_num; //프로젝트 번호 [PK, INT]
    private String proj_name; //프로젝트 이름 [VARCHAR]
    private String proj_desc; //프로젝트 설명 [TEXT]
    private Date proj_startdate; //프로젝트 시작일 [DATETIME]
    private Date proj_enddate; // 프로젝트 종료일 [DATETIME]
    private String proj_status; // 프로젝트 상태 [VARCHAR] (예정, 진행 중, 완료)
    private String proj_members; // 프로젝트 참여자 사번 [VARCHAR] (String으로 저장 후 string tokenizer로 데이터 사용)
    private Date proj_created; //프로젝트 생성 일시 [DATETIME]
    private Date proj_updated; // 프로젝트 정보 최종 수정 일시 [DATETIME]
    private String proj_import; //프로젝트 중요도 [VARCHAR] (낮음, 보통, 높음, 매우높음)
    private String proj_tag; //임의로 부여하는 프로젝트 태그 [VARCHAR] => 검색용
    private String proj_tagcol; //프로젝트 태그 컬러 [VARCHAR]
    private String proj_icon; //프로젝트 아이콘 코드 [VARCHAR] => 부트스트랩 아이콘
    private int proj_progress; //프로젝트 진행도
    private int proj_fk_dpart_num; //프로젝트 부서 번호 [FK, INT]
    private int proj_fk_user_num; //프로젝트 담당자 사번 [FK, INT]
    private int proj_fk_comp_num; //프로젝트 회사 고유번호 [FK, INT]

    public static ProjectDto fromEntity(ProjectEntity entity) {
        ProjectDto dto = new ProjectDto();
        dto.setProj_pk_num(entity.getProjPkNum());
        dto.setProj_name(entity.getProjName());
        dto.setProj_desc(entity.getProjDesc());
        dto.setProj_startdate(entity.getProjStartdate());
        dto.setProj_enddate(entity.getProjEnddate());
        dto.setProj_status(entity.getProjStatus());
        dto.setProj_members(entity.getProjMembers());
        dto.setProj_created(entity.getProjCreated());
        dto.setProj_updated(entity.getProjUpdated());
        dto.setProj_import(entity.getProjImport());
        dto.setProj_tag(entity.getProjTag());
        dto.setProj_tagcol(entity.getProjTagcol());
        dto.setProj_icon(entity.getProjIcon());
        dto.setProj_progress(entity.getProjProgress());
        dto.setProj_fk_dpart_num(entity.getDepartmentEntity().getDpartFkDpartNum());
        dto.setProj_fk_user_num(entity.getUserEntity().getUserPkNum());
        dto.setProj_fk_comp_num(entity.getCompanyEntity().getCompPkNum());
        return dto;
    }
}