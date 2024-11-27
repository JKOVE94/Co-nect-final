package conect.data.dto;

import conect.data.entity.ReplyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyDto {
    private int reply_pk_num;
    private String reply_cont;
    private ProjectDto proj_entity;
    private PostDto post_entity;
    private UserDto user_entity;

    public static ReplyDto fromEntity(ReplyEntity entity) {
        ReplyDto dto = new ReplyDto();
        dto.setReply_pk_num(entity.getReplyPkNum());
        dto.setReply_cont(entity.getReplyCont());
        dto.setProj_entity(ProjectDto.fromEntity(entity.getProjectEntity()));
        dto.setPost_entity(PostDto.fromEntity(entity.getPostEntity()));
        dto.setUser_entity(UserDto.fromEntity(entity.getUserEntity()));
        return dto;
    }
}