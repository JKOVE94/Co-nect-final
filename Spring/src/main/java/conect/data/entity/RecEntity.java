package conect.data.entity;

import java.time.LocalDateTime;

public class RecEntity {
	
	private int recPkNum;
	private String recTitle;
	private String recContent;
	private LocalDateTime recDate;
	private UserEntity user;
	private ProjectEntity proj;

}
