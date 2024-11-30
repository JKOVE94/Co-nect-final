package conect.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.data.dto.TodoDto;
import conect.data.form.TodoForm;
import conect.service.board.proj.ProjServiceImpl;
import conect.service.function.todo.TodoServiceImpl;

@RestController
@RequestMapping("/function")
public class FunctionController {
	
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@Autowired
	private TodoServiceImpl todoServiceImpl;
	
    @GetMapping("/schedule/{usernum}")
    public Map<String, Object> getDataAll(@PathVariable("usernum")int usernum){
    	Map<String, Object> map = new HashMap<String, Object>();
    	
    	List<ProjectDto> projList = projServiceImpl.getScheduleAll(usernum);
    	List<TodoDto> todoList = todoServiceImpl.getTodoAll(usernum);
    	
    	map.put("proj", projList);
    	map.put("todo", todoList);
    	return map;
    }
    
    @DeleteMapping("/schedule/{id}")
    public Map<String,Object> dropTodo(@PathVariable("id")int id){
    	if (todoServiceImpl.dropTodoData(id)) {
    		return Map.of("isSuccess",true);
    	}
    	return Map.of("isSuccess",false);
    }
    
    @PutMapping("/schedule/{id}")
    public Map<String,Object> editTodo(@PathVariable("id")int id, @RequestBody TodoForm bean){
    	bean.setTodo_pk_num(id);
    	if (todoServiceImpl.editTodoData(bean)) {
    		return Map.of("isSuccess",true);
    	}
    	return Map.of("isSuccess",false);
    }
    
    @PostMapping("/schedule")
    public Map<String,Object> addTodo(@RequestBody TodoForm bean){
    	if(todoServiceImpl.addTodoData(bean)) {
    		return Map.of("isSuccess",true);
    	}
    	return Map.of("isSuccess",false);
    }
}
