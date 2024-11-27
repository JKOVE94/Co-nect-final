package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
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
	
	// 부서 번호를 기준으로 프로젝트 리스트 조회
    @GetMapping("/list/{dpartPkNum}")
    public List<ProjectEntity> getProjByDept(@PathVariable int dpartPkNum) {
        return projService.getProjByDept(dpartPkNum);
    }
	
	// 프로젝트 생성 API
	@PostMapping("/proj/create")
	public String createProject(@RequestBody ProjectDto projectDto) {
	    try {
	        projService.createProject(projectDto);
	        return "프로젝트가 생성 성공!"; 
	    } catch (Exception e) {
	        return "프로젝트 생성 실패: " + e.getMessage();
	    }
	}
}
