package conect.service.function.todo;

import conect.data.dto.TodoDto;
import conect.data.entity.TodoEntity;
import conect.data.form.TodoForm;
import conect.data.repository.TodoRepository;
import conect.data.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;
    
    
    @Override
    public List<TodoDto> getTodoAll(int usernum) {
    	return todoRepository.findByUser_UserPkNum(usernum)
        			.stream().map(TodoDto::fromEntity).toList();
    }
    
    @Override
    public boolean dropTodoData(int id) {
    	try {
    		todoRepository.deleteById(id);
    	} catch(Exception e) {
    		//예외처리
    		return false;
    	}
    	return true;
    }
    
    @Override
    public boolean addTodoData(TodoForm bean) {
    	try {
    		TodoEntity entity = TodoForm.toEntity(bean);
    		entity.setUser(userRepository.findById(bean.getTodo_fk_user_num()).get());
    		todoRepository.save(entity);
    	} catch(Exception e) {
    		System.out.println(e.getMessage());
    		return false;
    	}
    	return true;
    }

}
