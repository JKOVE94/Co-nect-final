package conect.data.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Setter
@Getter
@Entity
@Table(name = "company")
public class CompanyEntity {
    @Id
    private int compPkNum; //회사 고유번호 [PK, INT]
    private String compName; //회사 명 [VARCHAR]
    private String compPic; //회사 로고사진 경로 [VARCHAR] ( 0_asset/emp_pic)

    @OneToMany(mappedBy = "companyEntity",orphanRemoval = true)
    @JsonBackReference
    private List<UserEntity> userEntities;
}