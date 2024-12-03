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

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private ProjServiceImpl projServiceImpl;

    //즐겨찾기 (/board/favorite)

    //자유게시판 (/board/free)

    //프로젝트게시판 (/board/proj)
	
	// 전체 프로젝트 리스트 조회
	@GetMapping("/projlist")
	public ResponseEntity<?> getAllProjects() {
	    try {
	        List<ProjectDto> projectList = projServiceImpl.getListAll();
	        return ResponseEntity.ok(projectList); // 성공 시 전체 리스트 반환
	    } catch (Exception e) {
	        e.printStackTrace(); // 로그로 에러 확인
	        return ResponseEntity
	        		.status(HttpStatus.INTERNAL_SERVER_ERROR)
	        		.body("프로젝트 리스트 조회 실패: " + e.getMessage());
	    }
	}

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

	// 프로젝트 수정
	@PutMapping("/projedit/{projPkNum}")
	public ResponseEntity<?> editProject(@PathVariable("projPkNum") int projPkNum, @RequestBody ProjectForm form) {
	    try {
	        projServiceImpl.editProject(projPkNum, form);
	        return ResponseEntity.ok("프로젝트 수정 성공!"); // 성공 시 메시지 반환
	    } catch (Exception e) {
	        e.printStackTrace(); // 로그로 에러 확인
	        return ResponseEntity
	        		.status(HttpStatus.INTERNAL_SERVER_ERROR)
	        		.body("프로젝트 수정 실패: " + e.getMessage());
	    }
	}
}
