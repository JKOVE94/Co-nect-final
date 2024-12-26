package conect.controller;
import conect.data.dto.TaskDto;
import conect.data.form.TaskForm;
import conect.data.form.TaskSearchForm;
import conect.service.board.proj.ProjServiceImpl;

import conect.service.board.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("{comp_pk_num}/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/proj/{task_fk_proj_num}")
    public List<TaskDto> getTaskByTaskFkProjNum(@PathVariable int task_fk_proj_num) {
        System.out.println("task_fk_proj_num : " + task_fk_proj_num);
        return taskService.getAllTask(task_fk_proj_num);
    }

    @GetMapping("/user/{user_pk_num}")
    public List<TaskDto> getTaskByTaskFkUserNum(@PathVariable int user_pk_num) {
        return taskService.getAllTaskWithUser(user_pk_num);
    }

    @PostMapping("/insert")
    public void insertTask(@RequestBody TaskForm form) {
        taskService.insertTask(form);
    }

    @PutMapping("/update/{task_pk_num}")
    public void updateTask(@RequestBody TaskForm form) {
        System.out.println("task_pk_num : " + form.getTask_pk_num());
        System.out.println("task_title : " + form.getTask_title());
        taskService.updateTask(form);
    }
    @DeleteMapping("/delete/{task_pk_num}")
    public void deleteTask(@PathVariable int task_pk_num) {
        taskService.deleteTask(task_pk_num);
    }

    @PostMapping("/search")
    public List<TaskDto> getTaskBySearching(@RequestBody TaskSearchForm form) {
        return taskService.getTaskBySearching(form.getProjectNum(), form.getSearchType(), form.getSearchValue());

    }

}

