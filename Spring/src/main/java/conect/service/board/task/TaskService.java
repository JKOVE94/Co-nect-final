package conect.service.board.task;

import conect.data.dto.ProjectmemberDto;
import conect.data.dto.TaskDto;
import conect.data.dto.TaskhistoryDto;
import conect.data.form.TaskForm;

import java.util.List;

import conect.data.form.TaskhistoryForm;
import org.springframework.data.domain.Page;

public interface TaskService {
    List<TaskDto> getAllTask(int task_fk_proj_num);

    TaskDto getTaskByNum(int taskPkNum);

    List<TaskDto> getAllTaskWithUser(int user_pk_num);

    List<TaskDto> getAllTaskByProjectAndUser(int projectNum, int userNum);

    void insertTask(TaskForm form);

    void updateTask(TaskForm form);

    void deleteTask(int task_pk_num);

    List<TaskDto> getTaskBySearching(int projectNum, String searchType, String searchValue);

    List<TaskDto> getRelatedTasks(int taskPkNum);

    List<TaskhistoryDto> getTaskHistoryByTaskNum(int taskPkNum);

    // 페이징
    public Page<TaskDto> getListByProject(int projectNum, int page, int pageSize, String sortField,
            String sortDirection, String searchText);

    List<ProjectmemberDto> getTaskMember(int compNum, int projNum);
    boolean insertTaskHistory(int taskPkNum, List<TaskhistoryForm> taskhistoryForms);
}
