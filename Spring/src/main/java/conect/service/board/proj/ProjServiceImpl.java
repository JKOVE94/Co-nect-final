package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.DepartmentEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.DepartmentRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository deptRepository;
    
    @Autowired
    private CompanyRepository compRepository;
	
	public List<ProjectDto> getScheduleAll(int usernum){
		String pattern = "(?<=,|^)"+ usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	
	public List<ProjectDto> getListAll(){
		return prepository.findAll().stream().map(ProjectDto::fromEntity).toList();
	}

	// 프로젝트 생성 메서드
	public void addProject(ProjectForm form) {
	    // DTO (ProjectForm) -> Entity (ProjectEntity)
	    ProjectEntity entity = ProjectForm.toEntity(form);

	    // proj_created가 null인 경우 현재 날짜로 설정
	    if (entity.getProjCreated() == null) {
	        entity.setProjCreated(new Date());
	    }
	    
	    // 부서, 담당자, 회사 설정
	    DepartmentEntity deptEntity  = deptRepository
	        .findById(form.getProj_fk_dpart_num())
	        .orElseThrow(() -> new RuntimeException("부서가 존재하지 않습니다."));
	    UserEntity userEntity  = userRepository
	        .findById(form.getProj_fk_user_num())
	        .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
//	    CompanyEntity compEntity  = compRepository
//	        .findById(form.getProj_fk_comp_num())
//	        .orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));
	    
	    entity.setDepartmentEntity(deptEntity);
	    entity.setUserEntity(userEntity);
//	    entity.setCompanyEntity(compEntity);

	    prepository.save(entity); // Entity 저장
	}
    
	public void editProject(int projPkNum, ProjectForm form) {
	    // 프로젝트 번호로 기존 프로젝트 조회
	    ProjectEntity entity = prepository
	        .findById(form.getProj_pk_num())
	        .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

	    // 기존 proj_created 값은 그대로 유지하고, 나머지 필드를 수정
	    ProjectEntity updatedEntity = ProjectForm.toEntity(form);

	    // proj_created 값을 기존 값으로 유지
	    updatedEntity.setProjCreated(entity.getProjCreated());
	    
	    entity.setProjName(updatedEntity.getProjName());
	    entity.setProjMembers(updatedEntity.getProjMembers());
	    entity.setProjImport(updatedEntity.getProjImport());
	    entity.setProjStatus(updatedEntity.getProjStatus());
	    entity.setProjDesc(updatedEntity.getProjDesc());
	    entity.setProjUpdated(new Date()); // 프로젝트 수정 날짜 설정

	    // 부서, 담당자, 회사 설정
	    DepartmentEntity deptEntity = deptRepository
	        .findById(form.getProj_fk_dpart_num())
	        .orElseThrow(() -> new RuntimeException("부서가 존재하지 않습니다."));
	    UserEntity userEntity = userRepository
	        .findById(form.getProj_fk_user_num())
	        .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
//	    CompanyEntity compEntity = compRepository
//	        .findById(form.getProj_fk_comp_num())
//	        .orElseThrow(() -> new RuntimeException("회사가 존재하지 않습니다."));

	    entity.setDepartmentEntity(deptEntity);
	    entity.setUserEntity(userEntity);
//	    entity.setCompanyEntity(compEntity);

	    prepository.save(entity); // 수정된 Entity 저장
	}

}
