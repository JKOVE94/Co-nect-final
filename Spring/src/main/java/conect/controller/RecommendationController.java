package conect.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.form.RecommendationForm;
import conect.service.board.recommendation.recommendationServiceImpl;

@RestController
@RequestMapping("/{compno}")
public class RecommendationController {
	
	@Autowired
	private recommendationServiceImpl recService;
	@Autowired
	private recommendationServiceImpl reclikesService;
	
	@GetMapping("/rec/{proj}")
	public ResponseEntity<Object> getRecList(@PathVariable(name="compno")int compno, @PathVariable(name="proj")int projnum){
		try {
			
			List<RecommendationDto> list = recService.getRecAll(projnum);
			return ResponseEntity.ok(list);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@GetMapping("/rec/{proj}/{rec}")
	public ResponseEntity<Object> getRecList(@PathVariable(name="compno")int compno, @PathVariable(name="proj")int projnum,
			@PathVariable("rec")int recnum){
		try {
			
			RecommendationDto dto = recService.getRecData(projnum, recnum);
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@PostMapping("/rec")
	public ResponseEntity<Object> addRec(@PathVariable(name="compno")int compno, @RequestBody RecommendationForm bean){
		try {
			recService.addRecData(bean);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@PutMapping("/rec/{rec}")
	public ResponseEntity<Object> updateRec(@PathVariable(name="compno")int compno, @PathVariable("rec")int recnum, @RequestBody RecommendationForm bean){
		try {
			RecommendationDto dto = recService.updateRecData(recnum, bean);
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/rec/{rec}")
	public ResponseEntity<Object> deleteRec(@PathVariable(name="compno")int compno, @PathVariable("rec")int recnum){
		try {
			recService.delRecData(recnum);
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/rec/like/{user}/{rec}")
	public ResponseEntity<Object> checkRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			
			boolean check = reclikesService.checkReclike(usernum, recnum);
			return ResponseEntity.ok(check);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
	
	@PostMapping("/rec/like/{user}/{rec}")
	public ResponseEntity<Object> addRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			reclikesService.addReclike(usernum, recnum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
	
	@DeleteMapping("/rec/like/{user}/{rec}")
	public ResponseEntity<Object> delRecLike(@PathVariable(name="compno")int compno, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		try {
			reclikesService.delReclike(usernum, recnum);
			
			return ResponseEntity.ok(true);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	} 
}
