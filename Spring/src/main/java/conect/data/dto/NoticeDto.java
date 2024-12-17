package conect.data.dto;

import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NoticeDto {
    private int noti_pk_num; // 공지사항 번호
    private String noti_title; // 공지사항 제목
    private String noti_content; // 공지사항 내용
    private LocalDate noti_regdate; // 공지사항 작성일
    private LocalDate noti_moddate; // 공지사항 수정일
    private int noti_deleted; // 공지사항 삭제 여부
    private int noti_import; // 공지사항 중요 여부
    private int noti_view; // 공지사항 조회수
    private int noti_fk_user_num; // 사용자 엔티티 번호

    public static NoticeDto fromEntity(NoticeEntity noticeEntity) {
        NoticeDto noticeDto = new NoticeDto();
        noticeDto.setNoti_pk_num(noticeEntity.getNotiPkNum());
        noticeDto.setNoti_title(noticeEntity.getNotiTitle());
        noticeDto.setNoti_content(noticeEntity.getNotiContent());
        noticeDto.setNoti_regdate(noticeEntity.getNotiRegdate());
        noticeDto.setNoti_moddate(noticeEntity.getNotiModdate());
        noticeDto.setNoti_deleted(noticeEntity.getNotiDeleted());
        noticeDto.setNoti_import(noticeEntity.getNotiImport());
        noticeDto.setNoti_view(noticeEntity.getNotiView());

        if (noticeEntity.getUserEntity() != null) {
            noticeDto.setNoti_fk_user_num(noticeEntity.getUserEntity().getUserPkNum());
        }

        return noticeDto;
    }
}
