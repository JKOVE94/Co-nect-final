package conect.data.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@Entity
@Table(name = "department")
public class DepartmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dpartPkNum; //부서 번호 [PK, INT]
    private String dpartName; //부서 이름 [VARCHAR]
    private String dpartMail; //부서 이메일 [VARCHAR]
    private int dpartFkDpartNum; //상위 부서 번호

    @OneToMany(mappedBy = "departmentEntity")
    @JsonBackReference
    private List<UserEntity> userEntities;

    @OneToMany(mappedBy = "departmentEntity")
    @JsonBackReference
    private List<ProjectEntity> userEntityList;
}