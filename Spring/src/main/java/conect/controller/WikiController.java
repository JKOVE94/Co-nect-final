package conect.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.WikiDto;
import conect.data.form.WikiForm;
import conect.service.board.wiki.WikiServiceImpl;

@RestController
@RequestMapping("/wiki")
public class WikiController {
	@Autowired
	private WikiServiceImpl wikiServiceImpl;

	// 모든 게시글 조회 (페이징, 검색, 정렬 포함)
	@GetMapping("/wikilist")
	public ResponseEntity<Map<String, Object>> getAllWikis(@RequestParam(name = "page", defaultValue = "0") int page, // 현재
			@RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
			@RequestParam(name = "sortField", defaultValue = "postRegdate") String sortField, // 정렬 필드
			@RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection, // 정렬 방향
			@RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색 분류
			@RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
	) {
		try {
			int pageSize = 10; // 한 페이지당 항목 수
			int blockSize = 5; // 한 블록당 페이지 버튼 수

			// 페이징 및 정렬 데이터를 포함한 게시글 목록 조회
			Page<WikiDto> wikiPage = wikiServiceImpl.getList(page, pageSize, sortField, sortDirection, searchType,
					searchText);

			// 총 페이지 수 계산
			int totalPages = wikiPage.getTotalPages();
			// 전체 블록 수 계산
			int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);

			// 현재 블록의 시작 및 끝 페이지 번호 계산
			int blockStart = pageBlock * blockSize; // 블록 시작 페이지
			int blockEnd = Math.min(blockStart + blockSize, totalPages); // 블록 끝 페이지

			// 이전 및 다음 블록 여부
			boolean hasPreviousBlock = pageBlock > 0;
			boolean hasNextBlock = pageBlock < totalBlocks - 1;

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("wikis", wikiPage.getContent()); // 게시글 데이터
			response.put("currentPage", wikiPage.getNumber()); // 현재 페이지 번호
			response.put("totalItems", wikiPage.getTotalElements()); // 총 게시글 수
			response.put("totalPages", totalPages); // 총 페이지 수
			response.put("currentBlock", pageBlock); // 현재 블록 번호
			response.put("totalBlocks", totalBlocks); // 총 블록 수
			response.put("blockStart", blockStart); // 현재 블록 시작 페이지
			response.put("blockEnd", blockEnd - 1); // 현재 블록 끝 페이지
			response.put("hasPreviousBlock", hasPreviousBlock); // 이전 블록 여부
			response.put("hasNextBlock", hasNextBlock); // 다음 블록 여부
			return new ResponseEntity<>(response, HttpStatus.OK); // 성공 시 200 응답 반환
		} catch (Exception e) {
			e.printStackTrace(); // 오류 로그 출력
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 시 500 응답 반환
		}
	}

	/*
	 * // 문서 목록 조회
	 * 
	 * @GetMapping("/wikilist") public ResponseEntity<List<WikiDto>> getListAll() {
	 * try { List<WikiDto> wikis = wikiServiceImpl.getListAll(); return
	 * ResponseEntity.ok(wikis); } catch (Exception e) { e.printStackTrace(); return
	 * ResponseEntity.status(500).build(); } }
	 */

	@GetMapping("/wikidetail/{wikiPkNum}")
	public WikiDto getWikiById(@PathVariable("wikiPkNum") int wikiPkNum) {
		System.out.println("wikiPkNum : " + wikiPkNum);
		return wikiServiceImpl.getWikiById(wikiPkNum);
	}

	@PostMapping("/wikiadd")
	public ResponseEntity<?> addWiki(
	        @RequestPart("form") WikiForm form, 
	        @RequestPart(value = "file", required = false) MultipartFile file) {
	    try {
	        // 문서 등록 서비스 호출
	        int wikiPkNum = wikiServiceImpl.addWiki(form);

	        // 파일이 존재하면 파일 업로드 처리
	        if (file != null && !file.isEmpty()) {
	            wikiServiceImpl.saveFile(file, wikiPkNum);
	        }

	        return ResponseEntity.ok(wikiPkNum); // 저장된 문서의 Primary Key 반환
	    } catch (Exception e) {
	        e.printStackTrace(); // 에러 로그
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("문서 생성 실패: " + e.getMessage());
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
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("문서 수정 실패: " + e.getMessage());
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
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("문서 삭제 실패: " + e.getMessage());
		}
	}
}
