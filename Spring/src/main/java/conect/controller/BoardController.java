package conect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	
	// 프로젝트 생성
	@PostMapping("/proj/create")
    public ResponseEntity<ProjectDto> projCreate(@RequestBody ProjectDto request) {
        ProjectDto projCreate = projService.projCreate(request); // 서비스 호출
        return ResponseEntity.status(HttpStatus.CREATED).body(projCreate);
    }
	
}
