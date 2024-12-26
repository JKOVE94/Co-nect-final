package conect.service.board.task;

import conect.data.dto.TaskDto;
import conect.data.form.TaskForm;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTask(int task_fk_proj_num);
    List <TaskDto> getAllTaskWithUser(int user_pk_num);
    void insertTask(TaskForm form);
    void updateTask(TaskForm form);
    void deleteTask(int task_pk_num);
    List<TaskDto> getTaskBySearching(int projectNum, String searchType, String searchValue);
}
