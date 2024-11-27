package conect.data.form;

import conect.data.entity.PostEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class PostForm {
    private int post_pk_num;
    private int post_kind;
    private String post_targetnum;
    private String post_name;
    private Date post_regdate;
    private String post_import;
    private String post_content;
    private String post_tag;
    private int post_depth;
    private int post_view;

    public PostEntity toEntity() {
        PostEntity entity = new PostEntity();
        entity.setPostPkNum(this.post_pk_num);
        entity.setPostKind(this.post_kind);
        entity.setPostTargetNum(this.post_targetnum);
        entity.setPostName(this.post_name);
        entity.setPostRegDate(this.post_regdate);
        entity.setPostImport(this.post_import);
        entity.setPostContent(this.post_content);
        entity.setPostTag(this.post_tag);
        entity.setPostDepth(this.post_depth);
        entity.setPostView(this.post_view);
        return entity;
    }
}