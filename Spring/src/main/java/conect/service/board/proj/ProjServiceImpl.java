package conect.service.board.proj;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
import conect.data.repository.ProjectRepository;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;

    @Override
    public ProjectDto projCreate(ProjectDto request) {
        // DTO -> Entity
        ProjectEntity projEntity = new ProjectEntity();
        projEntity.setProjName(request.getProj_name());
        projEntity.setProjDesc(request.getProj_desc());
        projEntity.setProjStartDate(request.getProj_startdate());
        projEntity.setProjEndDate(request.getProj_enddate());
        projEntity.setProjStatus(request.getProj_status());
        projEntity.setProjMembers(request.getProj_members());
        projEntity.setProjCreated(new Date()); // 생성 일시는 서버에서 처리
        projEntity.setProjUpdated(new Date()); // 수정 일시는 서버에서 처리
        projEntity.setProjImport(request.getProj_import());
        projEntity.setProjTag(request.getProj_tag());
        projEntity.setProjTagCol(request.getProj_tagcol());
        projEntity.setProjIcon(request.getProj_icon());
   
        ProjectEntity savedEntity = prepository.save(projEntity);

        return ProjectDto.fromEntity(savedEntity);
    }
    
}
