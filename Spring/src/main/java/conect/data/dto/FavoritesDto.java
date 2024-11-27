package conect.data.dto;

import conect.data.entity.FavoritesEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoritesDto {
    private int favor_id;
    private PostDto post_entity;
    private ProjectDto project_entity;
    private UserDto user_entity;

    public static FavoritesDto fromEntity(FavoritesEntity entity) {
        FavoritesDto dto = new FavoritesDto();
        dto.setFavor_id(entity.getFavorId());
        dto.setPost_entity(PostDto.fromEntity(entity.getPostEntity()));
        dto.setProject_entity(ProjectDto.fromEntity(entity.getProjectEntity()));
        dto.setUser_entity(UserDto.fromEntity(entity.getUserEntity()));
        return dto;
    }
}