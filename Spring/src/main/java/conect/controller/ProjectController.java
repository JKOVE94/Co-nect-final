package conect.controller;
import conect.data.dto.ProjectDto;
import conect.service.board.proj.ProjServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/proj")
public class ProjectController {
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@GetMapping("/projread")
	public List<ProjectDto> getListAll(){
		return projServiceImpl.getListAll();
	}
	
	@GetMapping("/projread/{projPkNum}")
		public ProjectDto getProjById(@PathVariable("projPkNum")int projPkNum){
		return projServiceImpl.getProjById(projPkNum);
	}
	
    //프로젝트 게시판
	@GetMapping("/{compNum}")
	public List<ProjectDto> getAllProj(@PathVariable("compNum")int compNum){
		return projServiceImpl.getAllProjInfo(compNum);
	}

}
