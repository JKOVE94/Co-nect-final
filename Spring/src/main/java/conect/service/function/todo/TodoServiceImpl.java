package conect.service.function.todo;

import conect.data.dto.TodoDto;
import conect.data.entity.ShareEntity;
import conect.data.entity.TodoEntity;
import conect.data.entity.UserEntity;
import conect.data.form.TodoForm;
import conect.data.repository.ShareRepository;
import conect.data.repository.TodoRepository;
import conect.data.repository.UserRepository;
import conect.service.ResourceNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

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
    
    
    //로그인한 사원의 일정 목록
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
    
    //일정 추가
    @Override
    public void addTodoData(TodoForm bean) {
    	
		TodoEntity entity = TodoForm.toEntity(bean);
		
		Optional<UserEntity> user = userRepository.findById(bean.getTodo_fk_user_num());
        user.ifPresentOrElse(
            u -> entity.setUserEntity(u),
            () -> { throw new ResourceNotFoundException("사원 번호 " + bean.getTodo_fk_user_num() + "을 찾을 수 없습니다."); }
        );
		try {
			TodoEntity todo = todoRepository.save(entity);
			
			if(bean.getShare_user() != null) {
				for(int num:bean.getShare_user()) {
					ShareEntity share = new ShareEntity();
					share.setTodoEntity(todo);
					share.setShareUser(num);
					shareRepository.save(share);
				}
			}
		} catch(Exception e) {
			throw new RuntimeException("일정 등록 실패: " + e.getMessage());
		}
		
	}
    

    //일정 삭제
    @Override
    @Transactional
    public void dropTodoData(int id) {
    	try {
    		
    		Optional<TodoEntity> todoEntity = todoRepository.findById(id);
    	    if (!todoEntity.isPresent()) {
    	        throw new ResourceNotFoundException("삭제할 일정이 존재하지 않습니다.");
    	    }
    	    
    		shareRepository.deleteByTodoEntity_TodoPkNum(id);
    		todoRepository.deleteById(id);
    	} catch(Exception e) {
    		throw new RuntimeException("일정 삭제 실패: " + e.getMessage());
    	}
    }
    
    //일정 수정
    @Override
    @Transactional
    public void editTodoData(TodoForm bean) {
    	try {
    		TodoEntity entity = TodoForm.toEntity(bean);
    		
    		Optional<UserEntity> user = userRepository.findById(bean.getTodo_fk_user_num());
            user.ifPresentOrElse(
                u -> entity.setUserEntity(u),
                () -> { throw new ResourceNotFoundException("사원 번호 " + bean.getTodo_fk_user_num() + "을 찾을 수 없습니다."); }
            );
    		
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
    	} catch(Exception e) {
    		throw new RuntimeException("일정 수정 실패: " + e.getMessage());
    	}
    }

}