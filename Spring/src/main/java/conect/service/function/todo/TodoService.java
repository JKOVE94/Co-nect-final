package conect.service.function.todo;

import java.util.List;

import conect.data.dto.TodoDto;
import conect.data.form.TodoForm;

public interface TodoService {

	//로그인한 사용자의 todo list 반환
	List<TodoDto> getTodoAll(int usernum);
	
	//Todo 삭제
	boolean dropTodoData(int id);
	
	//Todo 등록
	boolean addTodoData(TodoForm bean);
}
