package conect.service.board.task;

import conect.data.dto.TaskDto;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTask(int task_fk_proj_num);
    List <TaskDto> getAllTaskWithUser(int user_pk_num);
}
