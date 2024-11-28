package conect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ProjectDto;
import conect.service.board.proj.ProjServiceImpl;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	
    //즐겨찾기 (/board/favorite)

    //자유게시판 (/board/free)

    //프로젝트게시판 (/board/proj)
	//프로젝트 번호로 프로젝트 리스트 불러오기
	@GetMapping("/projread/{projPkNum}")
	public Map<String, Object> getProjIdList(@PathVariable("projPkNum")int projPkNum){
		Map<String, Object> map = new HashMap<String, Object>();
		List<ProjectDto> projList = projServiceImpl.getProjIdList(projPkNum);
		
		map.put("proj", projList);
    	return map;
	}
	
}
