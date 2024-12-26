package conect.data.dto;

import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class NoticeDto {

    private int noti_pk_num;
    private String noti_title;
    private String noti_content;
    private int noti_fk_user_num;
    private int noti_fk_proj_num;
    private LocalDate noti_regdate;
    private LocalDate noti_modedate;
    private int noti_deleted;
    private int noti_import;
    private int noti_fk_comp_num;
    private String userName;// 작성자 명
    private String projName; // 프로젝트 명
    private int noti_view; // 조회수

    // 페이징 관련 필드 추가
    private List<NoticeDto> content;
    private int totalPages;
    private long totalElements;
    private int number;
    private boolean first;
    private boolean last;

    // fromEntity
    public static NoticeDto fromEntity(NoticeEntity entity) {
        NoticeDto dto = new NoticeDto();
        dto.setNoti_pk_num(entity.getNotiPkNum());
        dto.setNoti_title(entity.getNotiTitle());
        dto.setNoti_content(entity.getNotiContent());
        dto.setNoti_fk_user_num(entity.getUserEntity().getUserPkNum());
        dto.setNoti_fk_proj_num(entity.getProjectEntity().getProjPkNum());
        dto.setNoti_regdate(entity.getNotiRegdate());
        dto.setNoti_modedate(entity.getNotiModdate());
        dto.setNoti_deleted(entity.getNotiDeleted());
        dto.setNoti_import(entity.getNotiImport());
        dto.setNoti_view(entity.getNotiView());
        dto.setNoti_fk_comp_num(entity.getCompanyEntity().getCompPkNum());
        dto.setUserName(entity.getUserEntity().getUserName());
        dto.setProjName(entity.getProjectEntity().getProjTitle());
        return dto;
    }
}
