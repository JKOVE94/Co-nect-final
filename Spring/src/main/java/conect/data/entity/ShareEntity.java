package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "share")
public class ShareEntity {
   @Id
   private int shareUser; // 일정 공유된 pk num
   
   @ManyToOne
   @JoinColumn(name="share_fk_todo_num")
   @JsonIgnore
   private TodoEntity todo;
}

