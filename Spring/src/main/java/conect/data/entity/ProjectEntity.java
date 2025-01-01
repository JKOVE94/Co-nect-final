package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Setter
@Getter
@Entity
@Table(name = "project")
public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int projPkNum; // 프로젝트 번호 [PK, INT]
    private String projTitle; // 프로젝트 이름 [VARCHAR]
    private String projContent; // 프로젝트 설명 [TEXT]
    private LocalDate projStartdate; // 프로젝트 시작일 [DATETIME]
    private LocalDate projEnddate; // 프로젝트 종료일 [DATETIME]
    private String projStatus; // 프로젝트 상태 [VARCHAR] (예정, 진행 중, 완료)
    private LocalDate projCreated; // 프로젝트 등록일 [DATETIME]
    private LocalDate projUpdated; // 프로젝트 정보 최종 수정 일시 [DATETIME]

    @ManyToOne
    @JoinColumn(name = "proj_fk_comp_num")
    @JsonIgnore
    private CompanyEntity companyEntity;

    @ManyToOne
    @JoinColumn(name = "proj_fk_user_num")
    @JsonBackReference
    private UserEntity userEntity;

    @OneToMany(mappedBy = "projectEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<RecommendationEntity> recommendationEntities;

    @OneToMany(mappedBy = "projectEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ProjectmemberEntity> projectmemberEntities;

}