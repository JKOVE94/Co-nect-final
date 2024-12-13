package conect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conect.data.dto.RecommendationDto;
import conect.service.board.recommendation.recommendationServiceImpl;

@RestController
@RequestMapping("/{compno}/rec")
public class RecommendationController {
	
	@Autowired
	private recommendationServiceImpl recService;
	
	@GetMapping("/{proj}")
	public ResponseEntity<Object> getRecList(@PathVariable(name="compno")int compno, @PathVariable(name="proj")int projnum){
		try {
			List<RecommendationDto> list = recService.getRecAll(projnum);
			return ResponseEntity.ok(list);
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
}
