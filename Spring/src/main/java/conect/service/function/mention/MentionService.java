package conect.service.function.mention;

import java.util.List;

import conect.data.dto.UserDto;

public interface MentionService {
	
	//회사에 속한 전체 사원목록
	List<UserDto> getUserAll(int compno);
}
