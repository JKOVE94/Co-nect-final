package conect.data.form;

import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class TodoForm {
    private int todo_pk_num; //투두리스트 고유 식별자 [PK, INT, INCREMENT]
    private String todo_title; // 투두리스트 제목 [VARCHAR]
    private String todo_content; //투두리스트 내용 [VARCHAR]
    private LocalDate todo_startdate; //투두리스트 시작일 [DATE] 
    private LocalDate todo_enddate; //투두리스트 종료일 [DATE]
    private Time todo_starttime; //투두리스트 시작 시간 [TIME]
    private Time todo_endtime; //투두리스트 종료 시간 [TIME]
    private String todo_category; //투두리스트 카테고리 [VARCHAR]
    
    private int todo_fk_user_num; //투두리스트 작성자 [INT}
    private List<Integer> shareList; //공유된 사람

    public static TodoEntity toEntity(TodoForm form) {
        //fk관련된 데이터는 servie단에서 findById로 찾아야 함
        TodoEntity entity = new TodoEntity();
        entity.setTodoPkNum(form.getTodo_pk_num());
        entity.setTodoTitle(form.getTodo_title());
        entity.setTodoContent(form.getTodo_content());
        entity.setTodoStartdate(form.getTodo_startdate());
        entity.setTodoEnddate(form.getTodo_enddate());
        entity.setTodoStarttime(form.getTodo_starttime());
        entity.setTodoEndtime(form.getTodo_endtime());
        entity.setTodoCategory(form.getTodo_category());

        return entity;
    }
}