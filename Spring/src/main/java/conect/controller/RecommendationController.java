package conect.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.service.board.recommendation.recommendationServiceImpl;

@RestController
@RequestMapping("/{compno}/rec")
public class RecommendationController {
	
	@Autowired
	private recommendationServiceImpl recService;

	
	
	@GetMapping("/{proj}")
	public ResponseEntity<Object> getRecList(@PathVariable(name="compno")int compno, @PathVariable(name="proj")int projnum,
			@RequestParam(name="sortField", defaultValue = "recRegdate") String sortField,
            @RequestParam(name="sortDirection",defaultValue = "desc") String sortDirection,
            @RequestParam(name="page", defaultValue = "0") int page,
			@RequestParam(name="size", defaultValue = "10") int size){
		try {
			
			Page<RecommendationDto> list = recService.getRecAll(projnum, sortField, sortDirection, page, size);
			
			return ResponseEntity.ok(list);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/{proj}/{rec}")
	public ResponseEntity<Object> getRecDetail(@PathVariable(name="compno")int compno, @PathVariable(name="proj")int projnum,
			@PathVariable("rec")int recnum){
		try {
			
			RecommendationDto dto = recService.getRecData(projnum, recnum);
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@PostMapping("/")
	public ResponseEntity<Object> addRec(@PathVariable(name="compno")int compno, @RequestBody RecommendationForm bean){
		try {
			recService.addRecData(bean);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@PutMapping("/{rec}")
	public ResponseEntity<Object> updateRec(@PathVariable(name="compno")int compno, @PathVariable("rec")int recnum, @RequestBody RecommendationForm bean){
		try {
			RecommendationDto dto = recService.updateRecData(recnum, bean);
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/{rec}")
	public ResponseEntity<Object> deleteRec(@PathVariable(name="compno")int compno, @PathVariable("rec")int recnum){
		try {
			recService.delRecData(recnum);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> checkRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			
			boolean check = recService.checkReclike(usernum, recnum);
			return ResponseEntity.ok(check);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@PostMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> addRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			recService.addReclike(usernum, recnum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@DeleteMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> delRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			recService.delReclike(usernum, recnum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@PostMapping("/reply")
	public ResponseEntity<Object> addRecReply(@RequestBody ReplyForm bean){
		try {
			recService.addRecReply(bean);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/reply/{recPkNum}")
	public ResponseEntity<Object> getRecReplyAll(@PathVariable("recPkNum") int recPkNum){
		try {
			List<ReplyDto> list = recService.getReplyAll(recPkNum);
			return ResponseEntity.ok(list);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> checkReplyLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){
		try {
			
			boolean check = recService.checkReplylike(usernum, replynum);
			return ResponseEntity.ok(check);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@PostMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> addReplyLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){
		try {
			recService.addReplylike(usernum, replynum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@DeleteMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> delReplyLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){
		try {
			recService.delReplylike(usernum, replynum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@DeleteMapping("/reply/{replyPkNum}")
	public ResponseEntity<Object> delReplyData(@PathVariable(name="compno")int compno, @PathVariable(name="replyPkNum")int replyPkNum){
		try {
			recService.delReplyData(replyPkNum);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@PutMapping("/reply")
	public ResponseEntity<Object> updateReplyData(@PathVariable(name="compno")int compno, @RequestBody ReplyForm bean){
		try {
			ReplyDto dto =  recService.updateReplyData(bean);
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
}
