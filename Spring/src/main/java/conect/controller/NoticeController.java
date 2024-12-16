package conect.controller;

import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;
import conect.service.board.notice.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notice")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    //프로젝트 관련 공지 게시글 전체 보기
    @GetMapping("project/{noti_fk_proj_num}")
    public List<NoticeDto> getNotiByNotiProjNum(@PathVariable int noti_fk_proj_num){
        System.out.println("notifknum :" + noti_fk_proj_num);
        return noticeService.getNoticeAll(noti_fk_proj_num);
    }

    //공지 게시글 하나 보기
    @GetMapping("/{notiPkNum}")
    public Optional<NoticeDto> getNoticeOne(@PathVariable int notiPkNum){
        System.out.println("notiNum:"+ notiPkNum);
        return noticeService.getOneNotice(notiPkNum);
    }

    //공지 게시글 수정
    @PutMapping("update/{notiPkNum}")
    public void updateNotice(@RequestBody NoticeForm form){
        System.out.println("update notiForm :"+ form);
        System.out.println("update notiPkNum:" +form.getNoti_pk_num());
        System.out.println("update:"+form.getNoti_name());
        System.out.println("update:"+form.getNoti_desc());
        System.out.println("update:"+form.getNoti_fk_user_num());
        System.out.println("update:"+form.getNoti_fk_proj_num());
        System.out.println("update:"+form.getNoti_regdate());
        noticeService.upNotice(form);
    }

    //공지 게시글 추가
    @PostMapping("/insert")
    public void addNotice(@RequestBody NoticeForm form){
        System.out.println("addForm :"+ form);
        noticeService.addNotice(form);
    }

    //공지 게시글 삭제
    @DeleteMapping("/delete/{notiPkNum}")
    public void deleteNotice(@PathVariable int notiPkNum){
        System.out.println("deleteNotiNum :" + notiPkNum);
        noticeService.delNotice(notiPkNum);
    }
}
