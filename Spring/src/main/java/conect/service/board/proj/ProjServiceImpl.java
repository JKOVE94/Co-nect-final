package conect.service.board.proj;

import conect.data.dto.TaskDto;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjServiceImpl implements ProjService {

    @Autowired
    private ProjectRepository prepository;

    @Autowired
    private TaskRepository taskRepository;

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
}
