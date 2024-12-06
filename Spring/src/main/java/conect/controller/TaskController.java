package conect.controller;
import conect.data.dto.TaskDto;
import conect.service.board.proj.ProjServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@RequestMapping("/proj/{task_fk_proj_num}")
    public List<TaskDto> getTaskByTaskFkProjNum(@PathVariable("task_fk_proj_num") int task_fk_proj_num) {
        return projServiceImpl.getAllTask(task_fk_proj_num);
    }

    @RequestMapping("/user/{user_pk_num}")
    public List<TaskDto> getTaskByTaskFkUserNum(@PathVariable("user_pk_num") int user_pk_num) {
        return projServiceImpl.getAllTaskWithUser(user_pk_num);
    }


}
