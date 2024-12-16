package conect.data.dto;

import conect.data.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class NoticeDto {
    private int noti_pk_num;
    private String noti_name;
    private  String noti_desc;
    private int noti_fk_user_num;
    private int noti_fk_proj_num;
    private LocalDate noti_regdate;
    private String userName;//작성자 명
    private String projName; //프로젝트 명

    //fromEntity
    public  static NoticeDto fromEntity(NoticeEntity entity){
        NoticeDto dto = new NoticeDto();
        dto.setNoti_pk_num(entity.getNotiPkNum());
        dto.setNoti_name(entity.getNotiName());
        dto.setNoti_desc(entity.getNotiDesc());
        dto.setNoti_fk_user_num(entity.getUserEntity().getUserPkNum());
        dto.setNoti_fk_proj_num(entity.getProjectEntity().getProjPkNum());
        dto.setNoti_regdate(entity.getNotiRegdate());
        dto.setUserName(entity.getUserEntity().getUserName());
        dto.setProjName(entity.getProjectEntity().getProjName());
        return dto;
    }
}
