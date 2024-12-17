package conect.data.form;

import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NoticeForm {
    private int noti_pk_num; // 공지사항 번호
    private String noti_title; // 공지사항 제목
    private String noti_content; // 공지사항 내용
    private LocalDate noti_regdate; // 공지사항 작성일
    private LocalDate noti_moddate; // 공지사항 수정일
    private int noti_deleted; // 공지사항 삭제 여부
    private int noti_import; // 공지사항 중요 여부
    private int noti_view; // 공지사항 조회수
    private int noti_fk_user_num; // 사용자 엔티티 번호

    public static NoticeEntity toEntity(NoticeForm form) {
        NoticeEntity entity = new NoticeEntity();
        entity.setNotiPkNum(form.getNoti_pk_num());
        entity.setNotiTitle(form.getNoti_title());
        entity.setNotiContent(form.getNoti_content());
        entity.setNotiRegdate(form.getNoti_regdate());
        entity.setNotiModdate(form.getNoti_moddate());
        entity.setNotiDeleted(form.getNoti_deleted());
        entity.setNotiImport(form.getNoti_import());
        entity.setNotiView(form.getNoti_view());
        return entity;
    }
}
