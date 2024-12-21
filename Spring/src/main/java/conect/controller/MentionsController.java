package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import conect.data.dto.UserDto;
import conect.service.ResourceNotFoundException;
import conect.service.function.mention.MentionServiceImpl;

@RestController
public class MentionsController {
	
	@Autowired
	private MentionServiceImpl mentionServiceImpl;
	
	@GetMapping("/mention/{compNum}")
	public ResponseEntity<Object> getAccountAll(@PathVariable("compNum")int compNum){
		try {
			List<UserDto> list = mentionServiceImpl.getUserAll(compNum);
			return ResponseEntity.ok(list);
		} catch(ResourceNotFoundException e) {
			//회사번호에 해당하는 사원이 없을 경우
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 타입 입니다 : " + e.getMessage());
    }

}

