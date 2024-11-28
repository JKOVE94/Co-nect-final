package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.DepartmentEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.repository.CompanyRepository;
import conect.data.repository.DepartmentRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository projrepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository deptRepository;
    
    @Autowired
    private CompanyRepository compRepository;
    /*
    // 모든 프로젝트 목록 반환
    public List<ProjectDto> getAllProjects() {
        List<ProjectEntity> projects = projrepository.findAll();
        return projects.stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    
    // 부서 번호를 기준으로 프로젝트 리스트 가져오기
    public List<ProjectEntity> getProjByDept(int dpartFkDpartNum) {
        return projrepository.findByDepartmentEntity_dpartFkDpartNum(dpartFkDpartNum);
    }
    */
    
    // 프로젝트 생성 메서드
    @Override
    public void createProject(ProjectDto projectDto) {
        // DTO를 Entity로 변환
        ProjectEntity entity = new ProjectEntity();
        entity.setProjPkNum(projectDto.getProj_pk_num());
        entity.setProjName(projectDto.getProj_name());
        entity.setProjDesc(projectDto.getProj_desc());
        entity.setProjStartdate(projectDto.getProj_startdate());
        entity.setProjEnddate(projectDto.getProj_enddate());
        entity.setProjStatus(projectDto.getProj_status());
        entity.setProjMembers(projectDto.getProj_members());
        entity.setProjCreated(new Date());
        entity.setProjImport(projectDto.getProj_import());
        entity.setProjTag(projectDto.getProj_tag());
        entity.setProjTagcol(projectDto.getProj_tagcol());
        
        if (projectDto.getProj_updated() != null) {
            entity.setProjUpdated(projectDto.getProj_updated());
        }
        
        // 부서, 담당자, 회사 설정
        DepartmentEntity deptEntity  = deptRepository
        		.findById(projectDto.getProj_fk_dpart_num())
                .orElseThrow(() -> new RuntimeException("부서가 존재하지 않습니다."));
        UserEntity userEntity  = userRepository
        		.findById(projectDto.getProj_fk_user_num())
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
        CompanyEntity compEntity  = compRepository
        		.findById(projectDto.getProj_fk_comp_num())
                .orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));
        
        entity.setDepartmentEntity(deptEntity);  
        entity.setUserEntity(userEntity); 
        entity.setCompanyEntity(compEntity);

        // 프로젝트 저장
        projrepository.save(entity);
    }
    
}
