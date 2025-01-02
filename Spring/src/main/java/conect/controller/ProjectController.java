package conect.controller;

import conect.data.dto.ProjectDto;
import conect.data.form.ProjectForm;
import conect.service.board.proj.ProjService;
import conect.service.board.proj.ProjServiceImpl;

import conect.service.manage.proj.ManageProjService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("{compNum}/proj")
public class ProjectController {

	private ProjService projService;
	private ManageProjService manageProjService;

	public ProjectController(ProjServiceImpl projServiceImpl, ProjService projService, ManageProjService manageProjService) {

		this.projService = projService;
		this.manageProjService = manageProjService;
	}
	@GetMapping("/ProjSel/{userNum}")
	public List<ProjectDto> getUserProject(@PathVariable("compNum") int compNum, @PathVariable("userNum") int userNum) {
		return manageProjService.getProjectListWithUser(compNum, userNum);
	}

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
	/*
	 * // 모든 게시글 조회
	 * 
	 * @GetMapping("/projlist")
	 * public ResponseEntity<Map<String, Object>> getAllPosts(
	 * 
	 * @RequestParam(name = "page", defaultValue = "0") int page,
	 * 
	 * @RequestParam(name = "filter", required = false, defaultValue = "전체") String
	 * filter,
	 * 
	 * @RequestParam(name = "searchTerm", required = false, defaultValue = "")
	 * String searchTerm) {
	 * 
	 * try {
	 * int pageSize = 10;
	 * 
	 * PageRequest pageable = PageRequest.of(page, pageSize);
	 * 
	 * Page<ProjectDto> projectPage = projService.getList(page, pageSize);
	 * 
	 * Map<String, Object> response = new HashMap<>();
	 * response.put("content", projectPage.getContent());
	 * response.put("totalPages", projectPage.getTotalPages());
	 * response.put("totalElements", projectPage.getTotalElements());
	 * response.put("currentPage", projectPage.getNumber());
	 * response.put("pageSize", projectPage.getSize());
	 * 
	 * return ResponseEntity.ok(response);
	 * } catch (Exception e) {
	 * return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	 * }
	 * }
	 */

	@GetMapping("/projread")
	public List<ProjectDto> getListAll() {
		return projService.getListAll();
	}

	// 2024.12.27 대현 로직 수정


	@GetMapping("/projdetail/{projPkNum}")
	public ProjectDto getProjById(@PathVariable("projPkNum") int projPkNum) {
		System.out.println("-----------------");
		System.out.println("projPkNum :"+projPkNum);
		return projService.getProjById(projPkNum);
	}

	// 프로젝트 생성
	@PostMapping("/projadd")
	public ResponseEntity<?> addProject(@RequestBody ProjectForm form) {
		try {
			int projPkNum = projService.addProject(form); // 생성된 프로젝트 ID 반환
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
			projService.editProject(projPkNum, form);
			return ResponseEntity.ok("프로젝트 수정 성공!"); // 성공 시 메시지 반환
		} catch (Exception e) {
			e.printStackTrace(); // 로그로 에러 확인
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로젝트 수정 실패: " + e.getMessage());
		}
	}

	// 프로젝트 게시판
	@GetMapping("/")
	public List<ProjectDto> getAllProj(@PathVariable("compNum") int compNum) {
		return projService.getAllProjInfo(compNum);
	}

	@GetMapping("/user/{user_pk_num}")
	public ResponseEntity<Map<String, Object>> getUserRelatedData(@PathVariable("user_pk_num") int userPkNum) {
		Map<String, Object> userData = projService.getUserRelatedData(userPkNum);
		return ResponseEntity.ok(userData);
	}
}
