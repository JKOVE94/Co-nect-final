package conect.service.board.task;

import conect.data.dto.PostDto;
import conect.data.dto.ProjectmemberDto;
import conect.data.dto.TaskDto;
import conect.data.dto.TaskhistoryDto;
import conect.data.entity.PostEntity;
import conect.data.entity.TaskEntity;
import conect.data.entity.TaskhistoryEntity;
import conect.data.form.TaskForm;
import conect.data.form.TaskhistoryForm;
import conect.data.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private CompanyRepository compRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectmemberRepository projectmemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskhistoryRepository taskHistoryRepository;

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
//    @Override
//    public void updateTaskHistory(List<TaskhistoryEntity> TaskhistoryEnties) {
//
//    }

    @Override
    @Transactional
    @Modifying
    public void deleteTask(int task_pk_num) {
        List<Integer> childlist = taskRepository.findChildTask(task_pk_num);
        if (childlist.size() > 0) {
            childlist.forEach(taskRepository::deleteById);
            taskRepository.deleteById(task_pk_num);
        } else
            taskRepository.deleteById(task_pk_num);
    }

    @Override
    public List<TaskDto> getTaskBySearching(int projectNum, String searchType, String searchValue) {
        if (searchValue.equals("")) {
            return taskRepository.getTaskByTaskFkProjNum(projectNum).stream()
                    .map(TaskDto::fromEntity)
                    .collect(Collectors.toList());
        } else {
            if (searchType.equals("taskName")) {
                return taskRepository.getTaskBySearchingTitle(projectNum, searchValue).stream()
                        .peek(task -> task.setTaskDepth(0))
                        .map(TaskDto::fromEntity)
                        .collect(Collectors.toList());
            } else if (searchType.equals("taskUser")) {
                return taskRepository.getTaskBySearchingUser(projectNum, searchValue).stream()
                        .peek(task -> task.setTaskDepth(0))
                        .map(TaskDto::fromEntity)
                        .collect(Collectors.toList());
            }
        }
        return null;
    }

    // 페이징, 정렬, 검색
    @Override
    public Page<TaskDto> getListByProject(int projPkNum, int page, int pageSize, String sortField, String sortDirection,
            String searchText) {
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

    @Override
    public List<TaskDto> getRelatedTasks(int taskPkNum) {
       return taskRepository.findRelatedTaskLists(taskPkNum).stream()
               .map(TaskDto::fromEntity)
               .collect(Collectors.toList());
    }

    @Override
    public List<TaskhistoryDto> getTaskHistoryByTaskNum(int taskPkNum) {
        List<TaskhistoryEntity> entities = taskHistoryRepository
                .findByTaskEntity_TaskPkNumOrderByTaskhisUpdatedDesc(taskPkNum);
        return entities.stream()
                .map(TaskhistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectmemberDto> getTaskMember(int compNum, int projNum) {
        return projectmemberRepository.findByProjmemFkProjNum(projNum).stream()
                .map(ProjectmemberDto::fromEntity)
                .map(projectmemberDto -> {
                    projectmemberDto.setProjmem_name(
                            userRepository.findById(projectmemberDto.getProjmem_fk_user_num()).get().getUserName());
                    return projectmemberDto;
                })
                .collect(Collectors.toList());

    }

    @Override
    public boolean insertTaskHistory(int taskPkNum, List<TaskhistoryForm> taskhistoryFormList) {
        System.out.println("taskPkNum : " + taskPkNum);
        System.out.println(taskhistoryFormList.size());
        try {
            for (TaskhistoryForm form : taskhistoryFormList) {
                TaskhistoryEntity taskhistoryEntity = TaskhistoryForm.toEntity(form);
                taskhistoryEntity.setTaskEntity(taskRepository.findById(taskPkNum).get());
                taskhistoryEntity.setUserEntity(userRepository.findById(form.getTaskhis_fk_user_num()).get());
                taskhistoryEntity.setCompanyEntity(compRepository.findById(form.getTaskhis_fk_comp_num()).get());
                taskHistoryRepository.save(taskhistoryEntity);
            }
            return true;
        } catch (Exception e) {
            System.out.println("insertTaskHistory err : " + e);
            return false;
        }
    }
}
