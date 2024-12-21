package conect.service.function.mention;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conect.data.dto.UserDto;
import conect.data.repository.UserRepository;
import conect.service.ResourceNotFoundException;

@Service
public class MentionServiceImpl {

	@Autowired
	private UserRepository userRepository;
	
	//회사에 속한 전체 사원 목록
	public List<UserDto> getUserAll(int compNum) {
		List<UserDto> list =  
				userRepository
				.findByCompanyEntity_compPkNum(compNum)
				.stream()
				.map(UserDto::fromEntity)
				.toList();
		if (list.isEmpty()) {
            throw new ResourceNotFoundException("회사 인원을 찾을 수 없습니다. 회사 ID: " + compNum);
        }
        
        return list;
	}
}
