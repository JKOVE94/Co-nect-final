package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.UserDto;
import conect.service.function.mention.MentionServiceImpl;

@RestController
public class MentionsController {
	
	@Autowired
	private MentionServiceImpl mentionServiceImpl;
	
	@GetMapping("/mention/{compno}")
	public List<UserDto> getAccountAll(@PathVariable("compno")int compno){
		return mentionServiceImpl.getUserAll(compno);
	}

}
