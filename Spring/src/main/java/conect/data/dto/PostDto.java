package conect.data.dto;

import conect.data.entity.PostEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Getter
@Setter
public class PostDto {
    private int post_pk_num; //게시글 번호 [PK, INT, INCREMENT]
    private int post_kind; //게시글 유형 [INT]
    private String post_targetnum; //게시글 대상 사원번호 [VARCHAR] => String으로 작성 이후 데이터사용은 String tokenizer 사용
    private String post_name; //게시글 제목 [VARCHAR]
    private LocalDateTime post_regdate; //게시글 등록일 [DATETIME]
    private String post_import; //게시글 중요도 [VARCHAR] (낮음,보통,높음,매우 높음)
    private String post_content; //게시글 내용 [TEXT]
    private String post_tag; //게시글 태그 [VARCHAR]
    private int post_depth; //게시글 깊이 [INT] (기본값 0, 답글 설정시 사용)
    private int post_view; //게시글 조회수 [INT]
    private int post_fk_comp_num; //게시글 회사 고유번호 [FK, INT]
    private int post_fk_user_num; //게시글 작성자 사번 [FK, INT]
    private String user_name;
    private List<Map<Integer,String>> target_names;
    
    public static PostDto fromEntity(PostEntity entity) {
        PostDto dto = new PostDto();
        dto.setPost_pk_num(entity.getPostPkNum());
        dto.setPost_kind(entity.getPostKind());
        dto.setPost_targetnum(entity.getPostTargetnum());
        dto.setPost_name(entity.getPostName());
        dto.setPost_regdate(entity.getPostRegdate());
        dto.setPost_import(entity.getPostImport());
        dto.setPost_content(entity.getPostContent());
        dto.setPost_tag(entity.getPostTag());
        dto.setPost_depth(entity.getPostDepth());
        dto.setPost_view(entity.getPostView());
        dto.setUser_name(entity.getUserEntity().getUserName());
        
        // UserEntity에서 user_name을 가져와 설정
        if (entity.getUserEntity() != null) {
            dto.setUser_name(entity.getUserEntity().getUserName());
        } else {
            dto.setUser_name(""); // 예를 들어 user_name이 없으면 빈 문자열로 설정
        }

        // CompanyEntity가 null일 수 있는 경우 처리
        if (entity.getCompanyEntity() != null) {
        	dto.setPost_fk_comp_num(entity.getCompanyEntity().getCompPkNum());
        } else {
            // 예를 들어, null인 경우 기본값 설정
            dto.setPost_fk_comp_num(1); // 기본값 1을 설정하거나 다른 적절한 값으로 처리
        }

        // UserEntity가 null일 수 있는 경우 처리
        if (entity.getUserEntity() != null) {
        	dto.setPost_fk_user_num(entity.getUserEntity().getUserPkNum());
        } else {
            // 예를 들어, null인 경우 기본값 설정
            dto.setPost_fk_user_num(1); // 기본값 1을 설정하거나 다른 적절한 값으로 처리
        }

        return dto;
    }
}