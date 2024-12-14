package conect.service.function.mention;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conect.data.dto.UserDto;
import conect.data.repository.UserRepository;

@Service
public class MentionServiceImpl {

	@Autowired
	private UserRepository userRepository;
	
	public List<UserDto> getUserAll(int compno) {
		return userRepository
				.findByCompanyEntity_compPkNum(compno)
				.stream()
				.map(UserDto::fromEntity)
				.toList();
	}
}
