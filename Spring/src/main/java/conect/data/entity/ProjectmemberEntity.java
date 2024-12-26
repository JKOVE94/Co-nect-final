package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "projectmember")
public class ProjectmemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int projmemPkNum; // 프로젝트 멤버 번호 [PK, INT]

    @ManyToOne
    @JoinColumn(name = "projmem_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "projmem_fk_proj_num")
    private ProjectEntity projectEntity;
}
