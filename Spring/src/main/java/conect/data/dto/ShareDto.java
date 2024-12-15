package conect.data.dto;

import conect.data.entity.ReplyEntity;
import conect.data.entity.ShareEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareDto {
	private int share_fk_todo_num;
	private int share_user;
	
	public static ShareDto fromEntity(ShareEntity entity) {
		ShareDto dto = new ShareDto();
        dto.setShare_fk_todo_num(entity.getTodo().getTodoPkNum());
        dto.setShare_user(entity.getShareUser());
        return dto;
    }
}