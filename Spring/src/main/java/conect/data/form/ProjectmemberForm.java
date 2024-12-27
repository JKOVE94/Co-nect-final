package conect.data.form;

import conect.data.entity.ProjectmemberEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectmemberForm {
        private int projmem_fk_proj_num; // 프로젝트 엔티티 번호
        private int[] projmem_fk_user_num; // 사용자 엔티티 번호

}
