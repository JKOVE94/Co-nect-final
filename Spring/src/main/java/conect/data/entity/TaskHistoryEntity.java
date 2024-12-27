package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "taskhistory")
public class TaskHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "taskhis_pk_num")
    private int taskhisPkNum;

    @Column(name = "taskhis_beforevalue")
    private String taskhisBeforevalue;

    @Column(name = "taskhis_aftervalue")
    private String taskhisAftervalue;

    @Column(name = "taskhis_updated")
    private LocalDateTime taskhisUpdated;

    @Column(name = "taskhis_type")
    private String taskhisType;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_comp_num")
    private CompanyEntity companyEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_task_num")
    private TaskEntity taskEntity;

    @ManyToOne
    @JoinColumn(name = "taskhis_fk_tasklog_num")
    private TasklogEntity tasklogEntity; // Add this property
   
}
