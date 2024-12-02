package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.data.entity.UserEntity;
import conect.data.form.ProjectForm;
import conect.service.board.proj.ProjServiceImpl;
import conect.service.manage.user.UserServiceImpl;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@Autowired
	private UserServiceImpl userServiceImpl;

    //즐겨찾기 (/board/favorite)

    //자유게시판 (/board/free)

    //프로젝트게시판 (/board/proj)

	// 상세보기
	@GetMapping("/projread/{projPkNum}")
	public ProjectDto getProjById(@PathVariable("projPkNum") int projPkNum) {
		return projServiceImpl.getProjById(projPkNum);
	}

	// 프로젝트 생성
	@PostMapping("/projadd")
	public ResponseEntity<?> addProject(@RequestBody ProjectForm form) {
	    try {
	        int projPkNum = projServiceImpl.addProject(form); // 생성된 프로젝트 ID 반환
	        return ResponseEntity.ok(projPkNum); // 생성된 projPkNum 반환
	    } catch (Exception e) {
	        e.printStackTrace(); // 로그로 에러 확인
	        return ResponseEntity
	        		.status(HttpStatus.INTERNAL_SERVER_ERROR)
	        		.body("프로젝트 생성 실패: " + e.getMessage());
	    }
	}

	@PutMapping("/projedit/{projPkNum}")
	public String editProject(@PathVariable("projPkNum") int projPkNum, @RequestBody ProjectForm form) {
		try {
			projServiceImpl.editProject(projPkNum, form);
			return "프로젝트 수정 성공!";
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return "프로젝트 수정 실패: " + e.getMessage();
		}
	}

}
