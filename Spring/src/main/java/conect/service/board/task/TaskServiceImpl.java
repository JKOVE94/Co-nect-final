package conect.service.board.task;

import conect.data.dto.PostDto;
import conect.data.dto.TaskDto;
import conect.data.entity.PostEntity;
import conect.data.entity.TaskEntity;
import conect.data.form.TaskForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<TaskDto> getAllTask(int task_fk_proj_num) {
        return taskRepository.getTaskByTaskFkProjNum(task_fk_proj_num).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TaskDto> getAllTaskByProjectAndUser(int projectNum, int userNum) {
        return taskRepository.getTaskByProjectNumAndUserNum(projectNum, userNum).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDto> getAllTaskWithUser(int user_pk_num) {
        return taskRepository.getTaskByTaskFkUserNum(user_pk_num).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void insertTask(TaskForm form) {
        TaskEntity taskEntity = TaskForm.toEntity(form);
        taskEntity.setProjectEntity(projectRepository.findById(form.getTaskFkProjNum()).orElseThrow());
        taskEntity.setUserEntity(userRepository.findById(form.getTaskFkUserNum()).orElseThrow());
        taskRepository.save(taskEntity);
    }

    @Override
    public void updateTask(TaskForm form) {
        TaskEntity taskEntity = taskRepository.findById(form.getTaskPkNum()).orElseThrow();
        taskEntity.setTaskTitle(form.getTaskTitle());
        taskEntity.setTaskContent(form.getTaskContent());
        taskEntity.setTaskStartdate(form.getTaskStartdate());
        taskEntity.setTaskDeadline(form.getTaskDeadline());
        taskEntity.setTaskDuration(form.getTaskDuration());
        taskEntity.setTaskProgress(form.getTaskProgress());
        taskEntity.setTaskStatus(form.getTaskStatus());
        taskEntity.setTaskPriority(form.getTaskPriority());
        taskEntity.setTaskCreated(form.getTaskCreated());
        taskEntity.setTaskDepth(form.getTaskDepth());
        taskEntity.setTaskGroup(form.getTaskGroup());
        taskEntity.setTaskTagcol(form.getTaskTagcol());
        taskEntity.setProjectEntity(projectRepository.findById(form.getTaskFkProjNum()).orElseThrow());
        taskEntity.setUserEntity(userRepository.findById(form.getTaskFkUserNum()).orElseThrow());
        taskRepository.save(taskEntity);
    }

    @Override
    public void deleteTask(int task_pk_num) {
        List<Integer> childlist = taskRepository.findChildTask(task_pk_num);
        if(childlist.size() > 0){
            childlist.forEach(taskRepository::deleteById);
            taskRepository.deleteById(task_pk_num);
        }
        else taskRepository.deleteById(task_pk_num);
    }
    
 // 페이징, 정렬, 검색
    @Override
    public Page<TaskDto> getListByProject(int projPkNum, int page, int pageSize, String sortField, String sortDirection, String searchText) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        
        Page<TaskEntity> taskPage;
        
        if (searchText != null && !searchText.isEmpty()) {
            taskPage = taskRepository.findByProjectEntity_ProjPkNumAndTitleOrContent(projPkNum, searchText, pageable);
        } else {
            taskPage = taskRepository.findByProjectEntity_ProjPkNum(projPkNum, pageable);
        }

        return taskPage.map(TaskDto::fromEntity);
    }
    
    @Override
    public TaskDto getTaskByNum(int taskPkNum) {
        return taskRepository.findById(taskPkNum)
                .map(TaskDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskPkNum));
    }





}
