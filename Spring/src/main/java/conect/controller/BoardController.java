package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.service.board.proj.ProjService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private ProjService projService;

    //즐겨찾기 (/board/favorite)

    //자유게시판 (/board/free)

    //프로젝트게시판 (/board/proj)
	
	// 모든 프로젝트 목록 조회
//    @GetMapping("/proj/list")
//    public List<ProjectDto> getAllProjects() {
//        return projService.getAllProjects();
//    }
	
	/*
	// 상위부서 번호로 프로젝트 목록 조회
    @GetMapping("/proj/list/{dpartFkDpartNum}")
    public List<ProjectEntity> getDataAll(@PathVariable("dpartFkDpartNum") int dpartFkDpartNum) {
        return projService.getProjByDept(dpartFkDpartNum);
    }
    */
	
	// 프로젝트 생성 
	@PostMapping("/proj/create")
	public String createProject(@RequestBody ProjectDto projectDto) {
	    try {
	        projService.createProject(projectDto);
	        return "프로젝트가 생성 성공!"; 
	    } catch (Exception e) {
	    	e.printStackTrace(); // 로그로 에러 확인
	        return "프로젝트 생성 실패: " + e.getMessage();
	    }
	}
	
}
