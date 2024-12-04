package conect.controller;


import conect.service.board.proj.ProjServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/post")
public class PostController {
	
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@GetMapping("/{user_pk_num}")
    public ResponseEntity<Map<String, Object>> getUserRelatedData(@PathVariable("user_pk_num") int userPkNum) {
        Map<String, Object> userData = projServiceImpl.getUserRelatedData(userPkNum);
        return ResponseEntity.ok(userData);
    }


}
