package conect.data.form;

import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TodoForm {
    private int todo_pk_num; //투두리스트 고유 식별자 [PK, INT, INCREMENT]
    private String todo_title; // 투두리스트 제목 [VARCHAR]
    private String todo_content; //투두리스트 내용 [VARCHAR]
    private Date todo_start; //투두리스트 시작일 [DATETIME]
    private Date todo_end; //투두리스트 종료일 [DATETIME]
    private int todo_icon;
    private String todo_tagcol;
    private int todo_fk_user_num; //투두리스트 작성자 [INT}

    public static TodoEntity toEntity(TodoForm form) {
        //fk관련된 데이터는 servie단에서 findById로 찾아야 함
        TodoEntity entity = new TodoEntity();
        entity.setTodoPkNum(form.getTodo_pk_num());
        entity.setTodoTitle(form.getTodo_title());
        entity.setTodoContent(form.getTodo_content());
        entity.setTodoStart(form.getTodo_start());
        entity.setTodoEnd(form.getTodo_end());
        return entity;
    }
}