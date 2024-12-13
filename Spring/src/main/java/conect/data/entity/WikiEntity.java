package conect.data.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "wiki")
public class WikiEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int wikiPkNum; // 위키문서 번호
	private String wikiName; // 문서 이름
	private String wikiDesc; // 문서 작성 내용
	private boolean wikiIsNotice; // 공지 여부
	private Date wikiRegdate; // 작성일
	
	@ManyToOne
	@JoinColumn(name = "wiki_fk_proj_num")
	@JsonIgnore
	private ProjectEntity projectEntity;
	
	@ManyToOne
	@JoinColumn(name = "wiki_fk_user_num")
	@JsonIgnore
	private UserEntity userEntity;
}
