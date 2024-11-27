package conect.data.entity;

import conect.data.entity.ReplyEntity;
import conect.data.entity.TaskEntity;
import conect.data.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "project")
public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int projPkNum; //프로젝트 번호 [PK, INT]
    private String projName; //프로젝트 이름 [VARCHAR]
    private String projDesc; //프로젝트 설명 [TEXT]
    private Date projStartDate; //프로젝트 시작일 [DATETIME]
    private Date projEndDate; // 프로젝트 종료일 [DATETIME]
    private String projStatus; // 프로젝트 상태 [VARCHAR] (예정, 진행 중, 완료)
    private String projMembers; // 프로젝트 참여자 사번 [VARCHAR] (String으로 저장 후 string tokenizer로 데이터 사용)
    private Date projCreated; //프로젝트 생성 일시 [DATETIME]
    private Date projUpdated; // 프로젝트 정보 최종 수정 일시 [DATETIME]
    private String projImport; //프로젝트 중요도 [VARCHAR] (낮음, 보통, 높음, 매우높음)
    private String projTag; //임의로 부여하는 프로젝트 태그 [VARCHAR] => 검색용
    private String projTagCol; //프로젝트 태그 컬러 [VARCHAR]
    private String projIcon; //프로젝트 아이콘 코드 [VARCHAR] => 부트스트랩 아이콘

    @ManyToOne
    @JoinColumn(name="proj_fk_dpart_num")
    private DepartmentEntity departmentEntity;

    @ManyToOne
    @JoinColumn(name="proj_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name="proj_fk_comp_num")
    private CompanyEntity companyEntity;

    @OneToMany(mappedBy = "projectEntity")
    private List<TaskEntity> taskEntities;

    @OneToMany(mappedBy = "projectEntity")
    private List<ReplyEntity> replyEntities;

    @OneToMany(mappedBy = "projectEntity")
    private List<FavoritesEntity> favoritesEntities;
}