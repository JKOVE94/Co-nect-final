package conect.data.entity;
import java.time.LocalDate;

import com.google.common.io.Files;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "notice")
public class NoticeEntity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int notiPkNum;  //공지게시판 고유 번호 
	private String notiName; // 공지게시판 제목
	private String notiDesc; // 공지게시판 내용
	private LocalDate notiRegdate; //공지 업데이트 날
	
	@ManyToOne
    @JoinColumn(name = "noti_fk_proj_num")
    private ProjectEntity projectEntity;
	
    @ManyToOne
    @JoinColumn(name = "noti_fk_user_num")
    private UserEntity userEntity;


}
