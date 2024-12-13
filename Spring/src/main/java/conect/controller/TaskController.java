package conect.controller;
import conect.data.dto.TaskDto;
import conect.data.form.TaskForm;
import conect.service.board.proj.ProjServiceImpl;

import conect.service.board.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/task/proj/{task_fk_proj_num}")
    public List<TaskDto> getTaskByTaskFkProjNum(@PathVariable int task_fk_proj_num) {
        System.out.println("task_fk_proj_num : " + task_fk_proj_num);
        return taskService.getAllTask(task_fk_proj_num);
    }

    @GetMapping("/task/user/{user_pk_num}")
    public List<TaskDto> getTaskByTaskFkUserNum(@PathVariable int user_pk_num) {
        return taskService.getAllTaskWithUser(user_pk_num);
    }

    @PostMapping("/task/insert")
    public void insertTask(@RequestBody TaskForm form) {
        taskService.insertTask(form);
    }

    @PutMapping("/task/update/{task_pk_num}")
    public void updateTask(@RequestBody TaskForm form) {
        System.out.println("task_pk_num : " + form.getTask_pk_num());
        System.out.println("task_title : " + form.getTask_title());
        taskService.updateTask(form);
    }
    @DeleteMapping("/task/delete/{task_pk_num}")
    public void deleteTask(@PathVariable int task_pk_num) {
        taskService.deleteTask(task_pk_num);
    }



}

