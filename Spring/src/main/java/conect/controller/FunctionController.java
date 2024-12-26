package conect.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import conect.data.dto.TodoDto;
import conect.data.form.TodoForm;
import conect.service.ResourceNotFoundException;
import conect.service.function.todo.TodoServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/{compNum}/function")
public class FunctionController {
	
	@Autowired
	private TodoServiceImpl todoServiceImpl;
	
	// 유저의 개인 일정 리스트
    @GetMapping("/schedule/{userNum}")
    public ResponseEntity<List<TodoDto>> getDataAll(@PathVariable("compNum") int compNum, @PathVariable("userNum") int userNum) {
        List<TodoDto> todoList = todoServiceImpl.getTodoAll(userNum);
        return ResponseEntity.ok(todoList);
    }
    
    // 일정 등록
    @PostMapping("/schedule")
    public ResponseEntity<Object> addTodo(@PathVariable("compNum") int compNum, @RequestBody @Valid TodoForm bean) {
        todoServiceImpl.addTodoData(bean);
        return ResponseEntity.status(HttpStatus.CREATED).body("success");
    }

    // 개인 일정 삭제
    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<Object> dropTodo(@PathVariable("compNum") int compNum, @PathVariable("id") int id) {
        
    	todoServiceImpl.dropTodoData(id);
    	return ResponseEntity.ok("success");
    }

    // 개인 일정 수정
    @PutMapping("/schedule/{id}")
    public ResponseEntity<Object> editTodo(@PathVariable("compNum") int compNum, @PathVariable("id") int id, @RequestBody @Valid TodoForm bean) {
        bean.setTodo_pk_num(id);
        todoServiceImpl.editTodoData(bean);
        return ResponseEntity.ok("success");
    }
    
    //잘못된 입력 값 예외처리(Form)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 입력 값 입니다 : " + e.getMessage());
    }
    
    //입력 값 타입이 잘못된 경우
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 타입입니다 : " + e.getMessage());
    }
    
    //인증되지 않은 접근(Security)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("인증되지 않은 접근입니다 : " + e.getMessage());
    }

    // 리소스가 존재하지 않을 경우 예외처리
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    
    //예기치 않은 오류 발생 시 예외처리 (등록,수정,삭제)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Runtime Error: " + e.getMessage());
    }
    
    //서버 내부 오류 예외처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error: " + e.getMessage());
    }
    
}
