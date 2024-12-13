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
   @Column(name = "share_user")
   private String shareUser; // 공유된 사원 목록
   
   @OneToOne
   @JoinColumn(name="share_fk_todo_num")
   private TodoEntity todo;
}

