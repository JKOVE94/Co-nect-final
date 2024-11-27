package conect.data.form;

import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TodoForm {
    private int todo_pk_num;
    private String todo_title;
    private String todo_content;
    private Date todo_start;
    private Date todo_end;

    public TodoEntity toEntity() {
        TodoEntity entity = new TodoEntity();
        entity.setTodoPkNum(this.todo_pk_num);
        entity.setTodoTitle(this.todo_title);
        entity.setTodoContent(this.todo_content);
        entity.setTodoStart(this.todo_start);
        entity.setTodoEnd(this.todo_end);
        return entity;
    }
}