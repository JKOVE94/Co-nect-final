package conect.data.entity;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int compPkNum; // 회사 고유번호 [PK, INT]
    private String compName; // 회사 명 [VARCHAR]
    private String compPic; // 회사 로고사진 경로 [VARCHAR] ( 0_asset/emp_pic)
    private String compAddr; // 회사 주소 [VARCHAR]
    private String compTel; // 회사 전화번호 [VARCHAR]
    private String compWebsite; // 회사 웹사이트 [VARCHAR]

    @OneToMany(mappedBy = "companyEntity", orphanRemoval = true)
    @JsonBackReference
    private List<UserEntity> userEntities;

    @OneToMany(mappedBy = "companyEntity", orphanRemoval = true)
    @JsonBackReference
    private List<ProjectEntity> projectEntities;

}