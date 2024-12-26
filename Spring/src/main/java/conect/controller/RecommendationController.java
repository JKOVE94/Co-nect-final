package conect.controller;

import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.AccessDeniedException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.service.ResourceNotFoundException;
import conect.service.board.recommendation.recommendationService;
import conect.service.board.reply.replyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/{compNum}/rec")
public class RecommendationController {
	
	@Autowired
	private recommendationService recService;
	@Autowired
	private replyService replyService;
	
	//프로젝트에 속한 모든 건의사항 목록
	@GetMapping("/{proj}")
	public ResponseEntity<Object> getRecList(@PathVariable("compNum")int compNum, @PathVariable(name="proj")int projnum,
			@RequestParam(name="sortField", defaultValue = "recRegdate") String sortField,
            @RequestParam(name="sortDirection",defaultValue = "desc") String sortDirection,
            @RequestParam(name="page", defaultValue = "0") int page,
			@RequestParam(name="size", defaultValue = "10") int size){
			
		Page<RecommendationDto> list = recService.getRecAll(projnum, sortField, sortDirection, page, size);
		return ResponseEntity.ok(list);
	}
	
	//건의사항 게시글 상세 조회
	@GetMapping("/{proj}/{rec}")
	public ResponseEntity<Object> getRecDetail(@PathVariable("compNum")int compNum, 
			@PathVariable(name="proj")int projNum,
			@PathVariable("rec")int recNum,
			HttpServletRequest request, 
			HttpServletResponse response){

		recService.addRecView(recNum, request, response);
		RecommendationDto dto = recService.getRecOne(projNum, recNum);
		return ResponseEntity.ok(dto);
	}
	
	//건의사항 등록
	@PostMapping("/")
	public ResponseEntity<Object> addRec(@PathVariable("compNum")int compNum, @RequestBody @Valid RecommendationForm bean){
		
		recService.addRec(bean);
		return ResponseEntity.ok(true);
	}
	
	//건의사항 수정
	@PutMapping("/{rec}")
	public ResponseEntity<Object> updateRec(@PathVariable("compNum")int compNum, @PathVariable("rec")int recnum, @RequestBody @Valid RecommendationForm bean){
		
		RecommendationDto dto = recService.editRec(recnum, bean);
		return ResponseEntity.ok(dto);
	}
	
	//건의사항 삭제
	@DeleteMapping("/{rec}")
	public ResponseEntity<Object> deleteRec(@PathVariable("compNum")int compNum, @PathVariable("rec")int recnum){
		
		recService.dropRec(recnum);
		return ResponseEntity.ok(true);
	}
	
	//가장 좋아요 수가 많은 건의사항
	@GetMapping("/{proj}/mostlike")
    public ResponseEntity<Object> getMostLikeRec(@PathVariable("compNum") int compNum, @PathVariable("proj") int projnum) {
       
	   Page<RecommendationDto> list = recService.getMostLike(projnum);
       return ResponseEntity.ok(list);
    }
	
	//로그인한 유저가 건의사항 좋아요 눌렀는지 확인
	@GetMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> checkRecLike(@PathVariable("compNum")int compNum, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		
		boolean check = recService.checkReclike(usernum, recnum);
		return ResponseEntity.ok(check);
	}
	
	//건의사항 좋아요 등록
	@PostMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> addRecLike(@PathVariable("compNum")int compNum, 
			@PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		
		recService.addReclike(usernum, recnum);
		return ResponseEntity.ok(true);
	}
	
	//건의사항 좋아요 삭제
	@DeleteMapping("/like/{user}/{rec}")
	public ResponseEntity<Object> delRecLike(@PathVariable("compNum")int compNum, @PathVariable(name="user")int usernum,
			@PathVariable("rec")int recnum){
		
		recService.dropReclike(usernum, recnum);
		return ResponseEntity.ok(true);
	} 
	
	//모든 댓글
	@GetMapping("/reply/{recPkNum}")
	public ResponseEntity<Object> getRecReplyAll(@PathVariable("compNum")int compNum, @PathVariable("recPkNum") int recPkNum){

		List<ReplyDto> list = replyService.getReplyAll(recPkNum);
		return ResponseEntity.ok(list);
	}
	
	//댓글 등록
	@PostMapping("/reply")
	public ResponseEntity<Object> addRecReply(@PathVariable("compNum")int compNum, @RequestBody @Validated ReplyForm bean){
		
		replyService.addRecReply(bean);
		return ResponseEntity.ok(true);
	}
	
	//댓글 수정
	@PutMapping("/reply")
	public ResponseEntity<Object> updateReplyData(@PathVariable("compNum")int compNum, @RequestBody @Valid ReplyForm bean){
		
		ReplyDto dto =  replyService.editReply(bean);
		return ResponseEntity.ok(dto);
	} 
	
	//댓글 삭제
	@DeleteMapping("/reply/{replyPkNum}")
	public ResponseEntity<Object> delReplyData(@PathVariable("compNum")int compNum, @PathVariable(name="replyPkNum")int replyPkNum){
		
		replyService.dropReply(replyPkNum);
		return ResponseEntity.ok(true);	
	} 
	
	//로그인한 유저가 댓글 좋아요 눌렀는지 확인
	@GetMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> checkReplyLike(@PathVariable("compNum")int compNum, @PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){

		boolean check = replyService.checkReplylike(usernum, replynum);
		return ResponseEntity.ok(check);
	}
	
	//댓글 좋아요 등록
	@PostMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> addReplyLike(@PathVariable("compNum")int compNum, @PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){
		
		replyService.addReplylike(usernum, replynum);
		return ResponseEntity.ok(true);
	} 
	
	//댓글 좋아요 삭제
	@DeleteMapping("/replyLike/{user}/{reply}")
	public ResponseEntity<Object> delReplyLike(@PathVariable("compNum")int compNum,
			@PathVariable(name="user")int usernum,
			@PathVariable("reply")int replynum){
		
		replyService.dropReplylike(usernum, replynum);
		return ResponseEntity.ok(true);
	} 
	
	
	
	//잘못된 입력 값 예외처리(Form)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 입력 값 입니다 : " + e.getMessage());
    }
    
    //입력 값 타입이 잘못된 경우
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 타입입니다 : " + e.getMessage());
    }
    
    //인증되지 않은 접근(Security)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("인증되지 않은 접근입니다 : " + e.getMessage());
    }

    // 리소스가 존재하지 않을 경우 예외처리
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
    
    //예기치 않은 오류 발생 시 예외처리 (등록,수정,삭제)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Runtime Error: " + e.getMessage());
    }
    
    //서버 내부 오류 예외처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error: " + e.getMessage());
    }
	
}
