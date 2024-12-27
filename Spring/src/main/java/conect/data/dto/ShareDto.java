package conect.data.dto;

import conect.data.entity.ShareEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareDto {
    private int share_pk_num; // 공유 번호
    private int share_user; // 공유한 유저 번호
    private int todo_fk_num; // 일정 번호


    public static ShareDto fromEntity(ShareEntity shareEntity) {
        ShareDto shareDto = new ShareDto();
        shareDto.setShare_pk_num(shareEntity.getSharePkNum());
        shareDto.setShare_user(shareEntity.getShareUser());
        // TODO 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
        if (shareEntity.getTodoEntity() != null) {
            shareDto.setTodo_fk_num(shareEntity.getTodoEntity().getTodoPkNum());
        }
        return shareDto;
    }
}
