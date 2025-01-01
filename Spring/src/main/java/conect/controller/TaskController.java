package conect.controller;

import conect.data.dto.ProjectmemberDto;
import conect.data.dto.TaskDto;
import conect.data.dto.TaskhistoryDto;
import conect.data.form.TaskForm;
import conect.data.form.TaskSearchForm;
import conect.data.form.TaskhistoryForm;
import conect.service.board.proj.ProjServiceImpl;

import conect.service.board.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("{comp_pk_num}/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/task/proj/{task_fk_proj_num}")
    public List<TaskDto> getTaskByTaskFkProjNum(@PathVariable("task_fk_proj_num") int task_fk_proj_num) {
        System.out.println("task_fk_proj_num : " + task_fk_proj_num);
        return taskService.getAllTask(task_fk_proj_num);
    }

    @GetMapping("/task/{taskPkNum}")
    public TaskDto getTaskByNum(@PathVariable("taskPkNum") int taskPkNum) {
        System.out.println("taskPkNum : " + taskPkNum);
        return taskService.getTaskByNum(taskPkNum);
    }

    @GetMapping("/task/proj/{projectNum}/user/{userNum}")
    public List<TaskDto> getTaskByProjectAndUser(@PathVariable("projectNum") int projectNum,
            @PathVariable("userNum") int userNum) {
        return taskService.getAllTaskByProjectAndUser(projectNum, userNum);
    }

    @GetMapping("/user/{user_pk_num}")
    public List<TaskDto> getTaskByTaskFkUserNum(@PathVariable("user_pk_num") int user_pk_num) {
        return taskService.getAllTaskWithUser(user_pk_num);
    }

    @PostMapping("/insert")
    public void insertTask(@RequestBody TaskForm form) {
        taskService.insertTask(form);
    }

    @PutMapping("/update/{task_pk_num}")
    public void updateTask(@PathVariable("task_pk_num") int task_pk_num, @RequestBody TaskForm form) {
        form.setTaskPkNum(task_pk_num);
        taskService.updateTask(form);
    }

    @DeleteMapping("/task/delete/{task_pk_num}")
    public void deleteTask(@PathVariable("task_pk_num") int task_pk_num) {
        taskService.deleteTask(task_pk_num);
    }

    // @DeleteMapping("/task/delete/{task_pk_num}")
    // public ResponseEntity<?> deleteTask(@PathVariable("task_pk_num") int
    // task_pk_num) {
    // try {
    // taskService.deleteTask(task_pk_num); // 내부에서 권한 검사 수행
    // return ResponseEntity.noContent().build();
    // } catch (AccessDeniedException e) {
    // return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
    // } catch (NoSuchElementException e) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("태스크를 찾을 수 없습니다.");
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류
    // 발생");
    // }
    // }

    @GetMapping("/tasklist/proj/{projectNum}")
    public ResponseEntity<Map<String, Object>> getTasksByProject(
            @PathVariable("projectNum") int projectNum,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock,
            @RequestParam(name = "sortField", defaultValue = "taskCreated") String sortField,
            @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection,
            @RequestParam(name = "searchText", defaultValue = "") String searchText) {
        try {
            int pageSize = 10;
            int blockSize = 5;

            // 프로젝트 번호를 포함하여 서비스 메서드 호출
            Page<TaskDto> taskPage = taskService.getListByProject(projectNum, page, pageSize, sortField, sortDirection,
                    searchText);

            int totalPages = taskPage.getTotalPages();
            int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);
            int blockStart = pageBlock * blockSize;
            int blockEnd = Math.min(blockStart + blockSize, totalPages);
            boolean hasPreviousBlock = pageBlock > 0;
            boolean hasNextBlock = pageBlock < totalBlocks - 1;

            Map<String, Object> response = new HashMap<>();
            response.put("tasks", taskPage.getContent());
            response.put("currentPage", taskPage.getNumber());
            response.put("totalItems", taskPage.getTotalElements());
            response.put("totalPages", totalPages);
            response.put("currentBlock", pageBlock);
            response.put("totalBlocks", totalBlocks);
            response.put("blockStart", blockStart);
            response.put("blockEnd", blockEnd - 1);
            response.put("hasPreviousBlock", hasPreviousBlock);
            response.put("hasNextBlock", hasNextBlock);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/task/{taskPkNum}/related")
    public ResponseEntity<List<TaskDto>> getRelatedTasks(
            @PathVariable("taskPkNum") int taskPkNum,
            @RequestParam(name = "taskGroup", defaultValue = "0") int taskGroup,
            @RequestParam(name = "taskDepth", defaultValue = "0") int taskDepth) {
        try {
            List<TaskDto> relatedTasks = taskService.getRelatedTasks(taskPkNum);
            return new ResponseEntity<>(relatedTasks, HttpStatus.OK);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/task/history/{taskPkNum}")
    public ResponseEntity<List<TaskhistoryDto>> getTaskHistory(@PathVariable("taskPkNum") int taskPkNum) {
        try {
            List<TaskhistoryDto> taskHistory = taskService.getTaskHistoryByTaskNum(taskPkNum);
            return new ResponseEntity<>(taskHistory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/task/member/{projNum}")
    public List<ProjectmemberDto> getTaskMember(@PathVariable("comp_pk_num")int compNum, @PathVariable("projNum") int projNum) {
        return taskService.getTaskMember(compNum, projNum);
    }
    @PostMapping("/search")
    public List<TaskDto> getTaskBySearching(@RequestBody TaskSearchForm form) {
        return taskService.getTaskBySearching(form.getProjectNum(), form.getSearchType(), form.getSearchValue());

    }

    @PostMapping("/task/history/{taskPkNum}")
    public boolean insertTaskHistory(@PathVariable("taskPkNum") int taskPkNum, @RequestBody List<TaskhistoryForm> taskHistoryForms) {
        return taskService.insertTaskHistory(taskPkNum, taskHistoryForms);
    }


}
