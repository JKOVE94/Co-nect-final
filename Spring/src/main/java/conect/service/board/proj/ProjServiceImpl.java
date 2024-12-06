package conect.service.board.proj;

import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.repository.PostRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private PostRepository postRepository;
    
	
	public List<ProjectDto> getScheduleAll(int usernum){
		String pattern = "(?<=,|^)"+ usernum + "(?=,|$)";
		return prepository.findByProjMembersContaining(pattern)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	
	public List<ProjectDto> getListAll(){
		return prepository.findAll().stream().map(ProjectDto::fromEntity).toList();
	}
	
	public ProjectDto getProjById(int projPkNum) {
	    return prepository.findByIdWithUser(projPkNum)
	        .map(ProjectDto::fromEntity)
	        .orElseThrow(() -> new EntityNotFoundException("프로젝트를 찾을 수 없습니다. ID: " + projPkNum));
	}

    @Override
    public List<TaskDto> getAllTask(int task_fk_proj_num) {
        return taskRepository.getTaskByTaskFkProjNum(task_fk_proj_num).stream()
                .map(TaskDto:: fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDto> getAllTaskWithUser(int user_pk_num) {
        return taskRepository.getTaskByTaskFkUserNum(user_pk_num).stream()
                .map(TaskDto:: fromEntity)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getUserRelatedData(int userPkNum) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("tasks", taskRepository.getTaskByTaskFkUserNum(userPkNum).stream()
                .map(TaskDto:: fromEntity)
                .collect(Collectors.toList()));
        result.put("projects", prepository.getProjByTaskFkUserNum(userPkNum).stream()
                .map(ProjectDto:: fromEntity)
                .collect(Collectors.toList()));
        result.put("posts", postRepository.getPostByTaskFkUserNum(userPkNum).stream()
                .map(PostDto:: fromEntity)
                .collect(Collectors.toList()));
        return result;
    }
}
