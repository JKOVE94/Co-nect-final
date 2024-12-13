package conect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	
	//유저의 개인 일정 리스트
    @GetMapping("/schedule/{usernum}")
    public ResponseEntity<Object> getDataAll(@PathVariable("usernum")int usernum){
    	try {
        	List<TodoDto> todoList = todoServiceImpl.getTodoAll(usernum);
        	
        	return ResponseEntity.ok(todoList);
    	} catch(IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid input parameters");
		} catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
        }
    }
    
    //개인 일정 등록
    @PostMapping("/schedule")
    public ResponseEntity<Object> addTodo(@RequestBody TodoForm bean){
    	try {
    		todoServiceImpl.addTodoData(bean);
        	return ResponseEntity.ok(true); //등록 성공
    	} catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); 
	        //잘못된 요청이 들어온 경우
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
	    }
    }
    
    //개인 일정 삭제
    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<Object> dropTodo(@PathVariable("id")int id){
    	try {
    		if (todoServiceImpl.dropTodoData(id)) {
    			return ResponseEntity.ok(true); //삭제 성공
        	} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource Not Found"); 
				// 삭제할 개인일정이 없는 경우
			}
    	} catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); 
	        //잘못된 요청이 들어온 경우
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
	    }
    }
    
    //개인 일정 수정
    @PutMapping("/schedule/{id}")
    public ResponseEntity<Object> editTodo(@PathVariable("id")int id, @RequestBody TodoForm bean){
    	try {
    		bean.setTodo_pk_num(id);
    		if (todoServiceImpl.editTodoData(bean)) {
        		return ResponseEntity.ok(true); //수정 성공
        	} else {
        		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); 
        		// 잘못된 요청이 들어온 경우
        	}
    	} catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
	    }
    }  

}
