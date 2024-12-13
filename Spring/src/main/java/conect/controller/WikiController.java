package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.DepartmentDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.WikiDto;
import conect.data.form.ProjectForm;
import conect.data.form.WikiForm;
import conect.service.board.proj.ProjService;
import conect.service.board.proj.ProjServiceImpl;
import conect.service.board.wiki.WikiServiceImpl;

@RestController
@RequestMapping("/wiki")
public class WikiController {
	@Autowired
	private WikiServiceImpl wikiServiceImpl;

	// 문서 목록 조회
	@GetMapping("/wikilist")
	public ResponseEntity<List<WikiDto>> getListAll() {
		try {
			List<WikiDto> wikis = wikiServiceImpl.getListAll();
			return ResponseEntity.ok(wikis);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).build();
		}
	}
/*
	@GetMapping("/wikiread")
	public List<ProjectDto> getAllData() {
		return projServiceImpl.getListAll();
	}
*/
	@GetMapping("/wikidetail/{wikiPkNum}")
	public WikiDto getWikiById(@PathVariable("wikiPkNum")int wikiPkNum){
		System.out.println("wikiPkNum : "+ wikiPkNum);
		return wikiServiceImpl.getWikiById(wikiPkNum);
	}
	
	// 모든 프로젝트 목록 반환 (셀렉트 박스용)
    @GetMapping("/projects")
    public List<ProjectDto> getAllProjects() {
        return wikiServiceImpl.getAllProjects();
    }

	// 문서 생성
	@PostMapping("/wikiadd")
	public ResponseEntity<?> addWiki(@RequestBody WikiForm form) {
		try {
			int wikiPkNum = wikiServiceImpl.addWiki(form);
			return ResponseEntity.ok(wikiPkNum); 
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("문서 생성 실패: " + e.getMessage());
		}
	}

	// 문서 수정
	@PutMapping("/wikiedit/{wikiPkNum}")
	public ResponseEntity<?> editWiki(@PathVariable("wikiPkNum") int wikiPkNum, @RequestBody WikiForm form) {
		try {
			wikiServiceImpl.editWiki(wikiPkNum, form);
			return ResponseEntity.ok("문서 수정 성공!"); // 성공 시 메시지 반환
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("문서 수정 실패: " + e.getMessage());
		}
	}
	
	// 문서 삭제
	@DeleteMapping("/wikidelete/{wikiPkNum}")
	public ResponseEntity<?> deleteWiki(@PathVariable("wikiPkNum") int wikiPkNum) {
	    try {
	        wikiServiceImpl.deleteWiki(wikiPkNum);
	        return ResponseEntity.ok("문서 삭제 성공!");
	    } catch (Exception e) {
	        e.printStackTrace(); // 로그로 에러 확인
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("문서 삭제 실패: " + e.getMessage());
	    }
	}
}
