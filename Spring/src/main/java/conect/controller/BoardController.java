package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
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
	
	@GetMapping("/projread")
	public List<ProjectDto> getListAll() {
		return projServiceImpl.getListAll();
	}

	// 프로젝트 생성
	@PostMapping("/projadd")
	public String addProject(@RequestBody ProjectForm form) {
		try {
			projServiceImpl.addProject(form);
			return "프로젝트가 생성 성공!";
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return "프로젝트 생성 실패: " + e.getMessage();
		}
	}
	
	@PutMapping("/projedit")
	public String editProject(@RequestBody ProjectForm form) {
		try {
			projServiceImpl.editProject(form);
			return "프로젝트가 수정 성공!";
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return "프로젝트 수정 실패: " + e.getMessage();
		}
	}
}
