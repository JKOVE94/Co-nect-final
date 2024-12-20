package conect.service.function.todo;

import conect.data.dto.ShareDto;
import conect.data.dto.TodoDto;
import conect.data.entity.ShareEntity;
import conect.data.entity.TodoEntity;
import conect.data.form.TodoForm;
import conect.data.repository.ShareRepository;
import conect.data.repository.TodoRepository;
import conect.data.repository.UserRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.StringTokenizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShareRepository shareRepository;
    
    
    @Override
    public List<TodoDto> getTodoAll(int usernum) {
    	
    	//로그인한 사원의 개인일정목록
    	List<TodoEntity> todoList = todoRepository.findByUserEntity_UserPkNum(usernum);
    	
    	//공유된 일정목록
    	List<ShareEntity> shareList = shareRepository.findByShareUser(usernum);
    	
    	//로그인한 사원에게 공유된 일정인 경우 todoList에 추가
    	for(ShareEntity share:shareList) {
    		if (share.getShareUser() == usernum) {
    			todoList.add(share.getTodoEntity());
    		}
    	}
    	
    	return todoList.stream().map(TodoDto::fromEntity).toList();

    }
    
    @Override
    public void addTodoData(TodoForm bean) {
    	
		TodoEntity entity = TodoForm.toEntity(bean);
		entity.setUserEntity(userRepository.findById(bean.getTodo_fk_user_num()).get());
		TodoEntity todo = todoRepository.save(entity);
		
		if(bean.getShare_user() != null) {
			for(int num:bean.getShare_user()) {
				ShareEntity share = new ShareEntity();
				share.setTodoEntity(todo);
				share.setShareUser(num);
				shareRepository.save(share);
			}
		}
	}
    

    
    @Override
    @Transactional
    public boolean dropTodoData(int id) {
    	try {
    		shareRepository.deleteByTodoEntity_TodoPkNum(id);
    		todoRepository.deleteById(id);
    		return true;
    	} catch(Exception e) {
    		//예외처리
    		return false;
    	}
    }
    
    @Override
    @Transactional
    public boolean editTodoData(TodoForm bean) {
    	try {
    		TodoEntity entity = TodoForm.toEntity(bean);
    		entity.setUserEntity(userRepository.findById(bean.getTodo_fk_user_num()).get());
    		TodoEntity todo = todoRepository.save(entity);
    		
    		if(bean.getShare_user() != null) {

                for (int num : bean.getShare_user()) {
                    // 중복된 ShareEntity가 없다면 추가
                	if (shareRepository.findByShareUserAndTodoEntity_TodoPkNum(num, todo.getTodoPkNum()) == null) {
                		ShareEntity share = new ShareEntity();
                        share.setTodoEntity(todo);
                        share.setShareUser(num);
                        shareRepository.save(share);
                	};
                    
                }
    		}

    		return true;
    	} catch(Exception e) {
    		System.out.println(e.getMessage());
    		return false;
    	}
    }

}