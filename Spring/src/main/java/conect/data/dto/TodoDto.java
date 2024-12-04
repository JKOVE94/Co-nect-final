package conect.data.dto;

import conect.data.entity.TodoEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TodoDto {
    private int todo_pk_num; //투두리스트 고유 식별자 [PK, INT, INCREMENT]
    private String todo_title; // 투두리스트 제목 [VARCHAR]
    private String todo_content; //투두리스트 내용 [VARCHAR]
    private Date todo_start; //투두리스트 시작일 [DATETIME]
    private Date todo_end; //투두리스트 종료일 [DATETIME]
    private int todo_icon;
    private String todo_tagcol;
    private int todo_fk_user_num; //투두리스트 작성자 [INT}

    public static TodoDto fromEntity(TodoEntity entity) {
        TodoDto dto = new TodoDto();
        dto.setTodo_pk_num(entity.getTodoPkNum());
        dto.setTodo_title(entity.getTodoTitle());
        dto.setTodo_content(entity.getTodoContent());
        dto.setTodo_start(entity.getTodoStart());
        dto.setTodo_end(entity.getTodoEnd());
        dto.setTodo_icon(entity.getTodoIcon());
        dto.setTodo_tagcol(entity.getTodoTagcol());
        dto.setTodo_fk_user_num(entity.getUser().getUserPkNum());
        return dto;
    }
}