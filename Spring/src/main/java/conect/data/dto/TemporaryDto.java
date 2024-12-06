//package conect.data.dto;
//
//import conect.data.entity.PostEntity;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//public class TemporaryDto {
//    private int post_pk_num; // 게시글 번호
//    private int post_kind; // 게시글 유형
//    private String post_name; // 게시글 제목
//    private LocalDateTime post_regdate; // 게시글 등록일
//    private String post_content; // 게시글 내용
//    private int post_temp; // 임시 저장 여부 (0: 일반 저장, 1: 임시 저장)
//
//    public static TemporaryDto fromEntity(PostEntity entity) {
//        TemporaryDto dto = new TemporaryDto();
//        dto.setPost_pk_num(entity.getPostPkNum());
//        dto.setPost_kind(entity.getPostKind());
//        dto.setPost_name(entity.getPostName());
//        dto.setPost_regdate(entity.getPostRegdate());
//        dto.setPost_content(entity.getPostContent());
//        dto.setPost_temp(entity.getPostTemp());
//        return dto;
//    }
//}