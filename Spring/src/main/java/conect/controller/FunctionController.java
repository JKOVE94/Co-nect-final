package conect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.data.dto.TodoDto;
import conect.service.board.proj.ProjServiceImpl;
import conect.service.function.todo.TodoServiceImpl;

@RestController
@RequestMapping("/function")
public class FunctionController {
	
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@Autowired
	private TodoServiceImpl todoServiceImpl;
	@GetMapping("/test")
	public Map<String, String> test(){
		return Map.of("test","통과");
	}
    @GetMapping("/schedule/{usernum}")
    public Map<String, Object> getDataAll(@PathVariable("usernum")int usernum){
    	Map<String, Object> map = new HashMap<String, Object>();
    	
    	List<ProjectDto> projList = projServiceImpl.getScheduleAll(usernum);
    	//List<TodoDto> todoList = todoServiceImpl.getTodoAll(usernum);
    	
    	map.put("proj", projList);
    	//map.put("todo", todoList);
    	return map;
    }
}
