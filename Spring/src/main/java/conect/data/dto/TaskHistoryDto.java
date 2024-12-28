package conect.data.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

import conect.data.entity.TaskhistoryEntity;

@Getter
@Setter
public class TaskHistoryDto {
    private int taskhisPkNum;
    private String taskhisBeforevalue;
    private String taskhisAftervalue;
    private LocalDateTime taskhisUpdated;
    private String taskhisType;
    private int taskhisFkCompNum;
    private int taskhisFkUserNum;
    private int taskhisFkTaskNum;
    private String userName;  // 유저 이름을 저장할 필드 추가

    public static TaskHistoryDto fromEntity(TaskhistoryEntity entity) {
        TaskHistoryDto dto = new TaskHistoryDto();
        dto.setTaskhisPkNum(entity.getTaskhistoryPkNum());
        dto.setTaskhisBeforevalue(entity.getTaskhisBeforevalue());
        dto.setTaskhisAftervalue(entity.getTaskhisAftervalue());
        dto.setTaskhisUpdated(entity.getTaskhisUpdated());
        dto.setTaskhisType(entity.getTaskhisType());
        dto.setTaskhisFkCompNum(entity.getCompanyEntity().getCompPkNum());
        dto.setTaskhisFkUserNum(entity.getUserEntity().getUserPkNum());
        dto.setTaskhisFkTaskNum(entity.getTaskEntity().getTaskPkNum());
        dto.setUserName(entity.getUserEntity().getUserName());  // 유저 이름 설정
        return dto;
    }
}
