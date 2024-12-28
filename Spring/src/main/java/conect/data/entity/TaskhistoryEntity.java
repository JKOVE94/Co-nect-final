package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "taskhistory")
public class TaskhistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskhisPkNum; // 업무 이력 고유 식별자 [PK, INT, INCREMENT]
    private String taskhisBeforevalue; // 업무 이력 변경 전 값 [VARCHAR]
    private String taskhisAftervalue; // 업무 이력 변경 후 값 [VARCHAR]
    private String taskhisType; // 업무 이력 유형 [VARCHAR]
    private LocalDateTime taskhisUpdated; // 업무 이력 정보 최종 수정 일시 [DATETIME]

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_task_num")
    private TaskEntity taskEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_comp_num")
    private CompanyEntity companyEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_tasklog_num")
    private TasklogEntity tasklogEntity;
}
