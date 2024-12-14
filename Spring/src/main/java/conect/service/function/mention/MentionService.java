package conect.service.function.mention;

import java.util.List;

import conect.data.dto.UserDto;

public interface MentionService {
	
	List<UserDto> getUserAll(int compno);
}
