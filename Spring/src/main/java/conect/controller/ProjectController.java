package conect.controller;
import conect.data.dto.DepartmentDto;
import conect.data.dto.ProjectDto;
import conect.data.entity.DepartmentEntity;
import conect.data.form.ProjectForm;
import conect.service.board.proj.ProjService;
import conect.service.board.proj.ProjServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
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

	// 모달 삭제
	@DeleteMapping("/projdelete/{projPkNum}")
	public ResponseEntity<?> deleteProject(@PathVariable("projPkNum") int projPkNum) {
		try {
			projServiceImpl.deleteProject(projPkNum); // 삭제 처리
			return ResponseEntity.ok("프로젝트 삭제 성공!");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로젝트 삭제 실패: " + e.getMessage());
		}
	}


}
