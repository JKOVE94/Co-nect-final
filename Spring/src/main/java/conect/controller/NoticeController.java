package conect.controller;
import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;
import conect.service.Notice.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/main/{comp_pk_num}/notice")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    //프로젝트 관련 공지 게시글 전체 보기 + 검색기능
    @GetMapping("/list/{projNum}")
    public ResponseEntity<Map<String, Object>> getNotiByNotiProjNum(
            @PathVariable("projNum") int noti_fk_proj_num,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size,
            @RequestParam(defaultValue = "notiRegdate") String sortField,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchText
    ) {
        Page<NoticeDto> noticePage = noticeService.getNoticeAll(
                noti_fk_proj_num, page, size, sortField, sortDirection, searchType, searchText
        );

        Map<String, Object> response = new HashMap<>();
        response.put("content", noticePage.getContent());
        response.put("totalPages", noticePage.getTotalPages());
        response.put("totalElements", noticePage.getTotalElements());
        response.put("number", noticePage.getNumber());
        response.put("size", noticePage.getSize());

        return ResponseEntity.ok(response);
    }

    //공지 게시글 하나 보기
    @GetMapping("/{notiNum}")
    public Optional<NoticeDto> getNoticeOne(@PathVariable("notiNum") int notiPkNum
                                            , HttpServletRequest request
                                            , HttpServletResponse response
                                            ){
        System.out.println("notiNum:"+ notiPkNum);
        return noticeService.getOneNotice(notiPkNum, request, response);
    }


    //공지 게시글 수정
    @PutMapping("/update/{notiPkNum}")
    public void updateNotice(@PathVariable int notiPkNum, @RequestBody NoticeForm form){
        noticeService.upNotice(notiPkNum, form);
    }

    //공지 게시글 추가
    @PostMapping("/insert")
    public void addNotice(@RequestBody NoticeForm form, @PathVariable("comp_pk_num") int comp_pk_num){
        form.setNoti_fk_comp_num(comp_pk_num);//경로에 있는 회사 정보 저장
        form.setNoti_regdate(LocalDate.now());//생성날짜에 현재 날짜 넣기

        System.out.println("addForm :"+ form.getNoti_regdate());
        noticeService.addNotice(form);
    }

    //공지 게시글 삭제(임시 삭제 0->1)
    @DeleteMapping("/delete/{notiNum}")
    public void deleteNotice(@PathVariable("notiNum") int notiPkNum){
        System.out.println("deleteNotiNum :" + notiPkNum);
        noticeService.delNotice(notiPkNum);
    }
}
