package conect.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "share")
@IdClass(ShareId.class)
public class ShareEntity {

    @Id
    @Column(name = "share_user")
    private int shareUser; // 복합 키 필드 2

    @Id
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "share_fk_todo_num")
    @JsonIgnore
    private TodoEntity todo; // 관계 매핑
}