package conect.service.board.task;

import conect.data.dto.TaskDto;
import conect.data.entity.TaskEntity;
import conect.data.form.TaskForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.TaskRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<TaskDto> getAllTaskWithUser(int user_pk_num) {
        return taskRepository.getTaskByTaskFkUserNum(user_pk_num).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void insertTask(TaskForm form) {
        TaskEntity taskEntity = TaskForm.toEntity(form);
        taskEntity.setProjectEntity(projectRepository.findById(form.getTask_fk_proj_num()).get());
        taskEntity.setUserEntity(userRepository.findById(form.getTask_fk_user_num()).get());
        taskRepository.save(taskEntity);
    }

    @Override
    public void updateTask(TaskForm form) {
        TaskEntity taskEntity = taskRepository.findById(form.getTask_pk_num()).orElseThrow();
        taskEntity.setTaskTitle(form.getTask_title());
        taskEntity.setTaskDesc(form.getTask_desc());
        taskEntity.setTaskStartdate(form.getTask_startdate());
        taskEntity.setTaskDeadline(form.getTask_deadline());
        taskEntity.setTaskEnddate(form.getTask_enddate());
        taskEntity.setTaskDuration(form.getTask_duration());
        taskEntity.setTaskProgress(form.getTask_progress());
        taskEntity.setTaskStatus(form.getTask_status());
        taskEntity.setTaskPriority(form.getTask_priority());
        taskEntity.setTaskUpdated(form.getTask_updated());
        taskEntity.setTaskDepth(form.getTask_depth());
        taskEntity.setTaskTag(form.getTask_tag());
        taskEntity.setTaskTagcol(form.getTask_tagcol());
        taskEntity.setTaskFkTaskNum(form.getTask_fk_task_num());
        taskEntity.setProjectEntity(projectRepository.findById(form.getTask_fk_proj_num()).get());
        taskEntity.setUserEntity(userRepository.findById(form.getTask_fk_user_num()).get());
        taskRepository.save(taskEntity);
    }

    @Override
    public void deleteTask(int task_pk_num) {

        List<Integer> childlist =  taskRepository.findChildTask(task_pk_num);
        if(childlist.size() > 0){
            childlist.forEach(taskNum -> {
                taskRepository.deleteById(taskNum);
            });
            taskRepository.deleteById(task_pk_num);
        }
        else taskRepository.deleteById(task_pk_num);
    }
}