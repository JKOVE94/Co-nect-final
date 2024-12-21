package conect.data.dto;

import conect.data.entity.ShareEntity;
import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class TodoDto {
    private int todo_pk_num; // 투두리스트 고유 식별자
    private String todo_title; // 투두리스트 제목
    private String todo_content; // 투두리스트 내용
    private LocalDate todo_startdate; // 투두리스트 시작일
    private LocalDate todo_enddate; // 투두리스트 종료일
    private LocalTime todo_starttime; // 투두리스트 시작시간
    private LocalTime todo_endtime; // 투두리스트 종료시간
    private String todo_category; // 투두리스트 카테고리
    private int todo_fk_user_num; // 사용자 고유번호
    private List<Integer> share_user; // 공유된 사원 정보(사번)


    // Getters and Setters

    public static TodoDto fromEntity(TodoEntity todoEntity) {
        TodoDto todoDto = new TodoDto();
        todoDto.setTodo_pk_num(todoEntity.getTodoPkNum());
        todoDto.setTodo_title(todoEntity.getTodoTitle());
        todoDto.setTodo_content(todoEntity.getTodoContent());
        todoDto.setTodo_startdate(todoEntity.getTodoStartdate());
        todoDto.setTodo_enddate(todoEntity.getTodoEnddate());
        todoDto.setTodo_starttime(todoEntity.getTodoStarttime());
        todoDto.setTodo_endtime(todoEntity.getTodoEndtime());
        todoDto.setTodo_category(todoEntity.getTodoCategory());
        todoDto.setTodo_fk_user_num(todoEntity.getUserEntity().getUserPkNum());
        if(todoEntity.getShareEntities() != null) {
        	List<Integer> list = new ArrayList<Integer>();
        	for(ShareEntity share : todoEntity.getShareEntities()) {
        		list.add(share.getShareUser());
        	}
        	todoDto.setShare_user(list);
        }
        
        return todoDto;
    }

    // Getters and Setters 생략 (필요 시 추가하세요)
}
