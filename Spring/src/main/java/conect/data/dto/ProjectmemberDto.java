package conect.data.dto;

import conect.data.entity.ProjectmemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectmemberDto {
    private int projmem_pk_num; // 프로젝트 멤버 번호
    private int projmem_fk_user_num; // 사용자 엔티티 번호
    private int projmem_fk_proj_num; // 프로젝트 엔티티 번호
    private String projmem_name;

    // Getters and Setters

    public static ProjectmemberDto fromEntity(ProjectmemberEntity projectmemberEntity) {
        ProjectmemberDto projectmemberDto = new ProjectmemberDto();
        projectmemberDto.setProjmem_pk_num(projectmemberEntity.getProjmemPkNum());

        // 사용자 엔티티 및 프로젝트 엔티티의 PK 값을 가져오는 방법에 따라 수정 필요
        if (projectmemberEntity.getUserEntity() != null) {
            projectmemberDto.setProjmem_fk_user_num(projectmemberEntity.getUserEntity().getUserPkNum()); // 예시: 사용자 엔티티의
                                                                                                         // PK 값으로 수정
            projectmemberDto.setProjmem_name(projectmemberEntity.getUserEntity().getUserName());
        }
        if (projectmemberEntity.getProjectEntity() != null) {
            projectmemberDto.setProjmem_fk_proj_num(projectmemberEntity.getProjectEntity().getProjPkNum()); // 예시: 프로젝트
                                                                                                            // 엔티티의 PK
                                                                                                            // 값으로 수정
        }

        return projectmemberDto;
    }
}
