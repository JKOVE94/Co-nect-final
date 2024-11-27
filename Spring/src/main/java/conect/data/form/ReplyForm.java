package conect.data.form;

import conect.data.entity.ReplyEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyForm {
    private int reply_pk_num;
    private String reply_cont;

    public ReplyEntity toEntity() {
        ReplyEntity entity = new ReplyEntity();
        entity.setReplyPkNum(this.reply_pk_num);
        entity.setReplyCont(this.reply_cont);
        return entity;
    }
}