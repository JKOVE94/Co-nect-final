package conect.service.function.todo;

import java.util.List;

import conect.data.dto.TodoDto;

public interface TodoService {

	//로그인한 사용자의 todo list 반환
	List<TodoDto> getTodoAll(int usernum);
}
