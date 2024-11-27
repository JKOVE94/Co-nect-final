package conect.service.function.todo;

import conect.data.dto.TodoDto;
import conect.data.repository.TodoRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoRepository todoRepository;
    
    
    @Override
    public List<TodoDto> getTodoAll(int usernum) {
    	return todoRepository.findByUser_UserPkNum(usernum)
        			.stream().map(TodoDto::fromEntity).toList();
    }

}
