package conect.data.form;

import conect.data.entity.ShareEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareForm {
    private int share_pk_num; // 공유 번호
    private int share_user; // 공유한 유저 번호
    private int todo_fk_num; //

    public static ShareEntity fromEntity(ShareForm form) {
        ShareEntity shareEntity = new ShareEntity();
        shareEntity.setSharePkNum(form.getShare_pk_num());
        shareEntity.setShareUser(form.getShare_user());
        return shareEntity;
    }
}
