package conect.data.form;

import conect.data.entity.TodoEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TodoForm {
    private int todo_pk_num; // 투두리스트 고유 식별자
    @NotNull
    private String todo_title; // 투두리스트 제목
    private String todo_content; // 투두리스트 내용
    @NotNull
    private LocalDate todo_startdate; // 투두리스트 시작일
    @NotNull
    private LocalDate todo_enddate; // 투두리스트 종료일
    private LocalTime todo_starttime; // 투두리스트 시작시간
    private LocalTime todo_endtime; // 투두리스트 종료시간
    private String todo_category; // 투두리스트 카테고리
    @NotNull
    private int todo_fk_user_num; // 사용자 고유번호
    private List<Integer> share_user; //공유할 사원의 사번

    public static TodoEntity toEntity(TodoForm form) {
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