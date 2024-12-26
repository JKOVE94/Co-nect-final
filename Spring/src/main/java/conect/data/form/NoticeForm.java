package conect.data.form;

import java.time.LocalDate;
import java.util.List;

import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeForm {

    // private Integer noti_pk_num; 자동 증가로 삭제
    private String noti_title;
    private String noti_content;
    private int noti_fk_user_num;
    private int noti_fk_proj_num;
    private LocalDate noti_regdate;
    private LocalDate noti_moddate;
    private int noti_deleted;
    private int noti_import;
    private int noti_view;
    private int noti_fk_comp_num;

    // toEntity
    public static NoticeEntity toEntity(NoticeForm form) {
        NoticeEntity entity = new NoticeEntity();
        entity.setNotiTitle(form.getNoti_title());
        entity.setNotiContent(form.getNoti_content());
        entity.setNotiRegdate(form.getNoti_regdate()); // 등록날짜
        entity.setNotiModdate(form.getNoti_moddate()); // 수정날짜
        entity.setNotiDeleted(form.getNoti_deleted());
        entity.setNotiImport(form.getNoti_import());
        entity.setNotiView(form.getNoti_view());
        return entity;
    }
}
