package conect.data.dto;

import conect.data.entity.ShareEntity;
import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class TodoDto {
    private int todo_pk_num; //투두리스트 고유 식별자 [PK, INT, INCREMENT]
    private String todo_title; // 투두리스트 제목 [VARCHAR]
    private String todo_content; //투두리스트 내용 [VARCHAR]
    private LocalDate todo_startdate; //투두리스트 시작일 [DATE] 
    private LocalDate todo_enddate; //투두리스트 종료일 [DATE]
    private Time todo_starttime; //투두리스트 시작 시간 [TIME]
    private Time todo_endtime; //투두리스트 종료 시간 [TIME]
    private String todo_category; //투두리스트 카테고리 [VARCHAR]
    
    private int todo_fk_user_num;
    private List<Integer> shareList; //일정이 공유된 유저의 pk num

    public static TodoDto fromEntity(TodoEntity entity) {
        TodoDto dto = new TodoDto();
        dto.setTodo_pk_num(entity.getTodoPkNum());
        dto.setTodo_title(entity.getTodoTitle());
        dto.setTodo_content(entity.getTodoContent());
        dto.setTodo_startdate(entity.getTodoStartdate());
        dto.setTodo_enddate(entity.getTodoEnddate());
        dto.setTodo_starttime(entity.getTodoStarttime());
        dto.setTodo_endtime(entity.getTodoEndtime());
        dto.setTodo_category(entity.getTodoCategory());
        
        dto.setTodo_fk_user_num(entity.getUser().getUserPkNum());
        if(entity.getShareEntities() != null) {
        	List<Integer> list = new ArrayList<Integer>();
        	for(ShareEntity share:entity.getShareEntities()) {
        		list.add(share.getShareUser());
        	}
        	dto.setShareList(list);
        }
        
        return dto;
    }
}