package conect.controller;
import conect.data.dto.DepartmentDto;
import conect.data.dto.ProjectDto;
import conect.data.entity.DepartmentEntity;
import conect.data.form.ProjectForm;
import conect.service.board.proj.ProjService;
import conect.service.board.proj.ProjServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/proj")
public class ProjectController {
	@Autowired
	private ProjServiceImpl projServiceImpl;
	
	@Autowired
	private ProjService projService;
	
	// 프로젝트 목록 조회
		@GetMapping("/projlist")
		public ResponseEntity<List<ProjectDto>> getAllProjects() {
			try {
				List<ProjectDto> projects = projService.getAllProjects();
				return ResponseEntity.ok(projects);
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.status(500).build();
			}
		}

	
	@GetMapping("/projread")
	public List<ProjectDto> getListAll(){
		return projServiceImpl.getListAll();
	}
	
	@GetMapping("/projread/{projPkNum}")
		public ProjectDto getProjById(@PathVariable("projPkNum")int projPkNum){
		return projServiceImpl.getProjById(projPkNum);
	}
	
	// 모든 부서 목록 반환 (셀렉트 박스용)
    @GetMapping("/departments")
    public List<DepartmentDto> getAllDepartments() {
        return projServiceImpl.getAllDepartments();
    }

	// 프로젝트 생성
	@PostMapping("/projadd")
	public ResponseEntity<?> addProject(@RequestBody ProjectForm form) {
		try {
			int projPkNum = projServiceImpl.addProject(form); // 생성된 프로젝트 ID 반환
			return ResponseEntity.ok(projPkNum); // 생성된 projPkNum 반환
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로젝트 생성 실패: " + e.getMessage());
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
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로젝트 수정 실패: " + e.getMessage());
		}
	}
	
    //프로젝트 게시판
	@GetMapping("/{compNum}")
	public List<ProjectDto> getAllProj(@PathVariable("compNum")int compNum){
		return projServiceImpl.getAllProjInfo(compNum);
	}
	
	//검색 - status list 반환
	@GetMapping("/status/{compNum}")
	public Set<String> getStatusList(@PathVariable("compNum")int compNum){
		return projServiceImpl.getStatusAll(compNum);
	}
	
	//검색데이터 반환
	@GetMapping("/search")
	public List<ProjectDto> getSearchData(@RequestParam("status")String status,
										@RequestParam("searchText")String searchText){	
		return projServiceImpl.getSearchData(status, searchText);
	}

	// 모든 게시글 조회
	@GetMapping("/proj")
	public ResponseEntity<Map<String, Object>> getAllPosts(
	    @RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
	    @RequestParam(name = "pageSize", defaultValue = "10") int pageSize, // 한 페이지당 항목 수
	    @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색분류
	    @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
	) {
	    try {
	        // 페이징 및 정렬 서비스 호출
	        Page<ProjectDto> projectPage = projService.getList(page, pageSize, searchType, searchText);

	        // 응답 객체 구성
	        Map<String, Object> response = new HashMap<>();
	        response.put("content", projectPage.getContent()); // 현재 페이지 데이터
	        response.put("currentPage", projectPage.getNumber()); // 현재 페이지 번호
	        response.put("pageSize", projectPage.getSize()); // 한 페이지당 항목 수
	        response.put("totalItems", projectPage.getTotalElements()); // 전체 항목 수
	        response.put("totalPages", projectPage.getTotalPages()); // 전체 페이지 수
	        response.put("isLast", projectPage.isLast()); // 마지막 페이지 여부
	        response.put("isFirst", projectPage.isFirst()); // 첫 페이지 여부

	        // 상태 코드 200과 함께 응답 반환
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생 시
	    }
	}

	
	// 모달 삭제
	@DeleteMapping("/projdelete/{projPkNum}")  
	public ResponseEntity<?> deleteProject(@PathVariable("projPkNum") int projPkNum) {
	    try {
	        // 프로젝트 삭제 로직
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
}
