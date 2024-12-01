package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.service.board.proj.ProjServiceImpl;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private ProjServiceImpl projServiceImpl;

    //즐겨찾기 (/board/favorite)

    //자유게시판 (/board/free)

    //프로젝트게시판 (/board/proj)
	
	@GetMapping("/projread")
	public List<ProjectDto> getListAll(){
		return projServiceImpl.getListAll();
	}
	
	@GetMapping("/projread/{projPkNum}")
		public ProjectDto getProjById(@PathVariable("projPkNum")int projPkNum){
		return projServiceImpl.getProjById(projPkNum);
	}
	
    //프로젝트게시판 (/board/proj)
	@GetMapping("/{compNum}")
	public List<ProjectDto> getAllProj(@PathVariable("compNum")int compNum){
		return projServiceImpl.getAllProjInfo(compNum);
	}
	
}
