package conect.service.Notice;
import conect.data.dto.NoticeDto;
import conect.data.entity.NoticeEntity;
import conect.data.form.NoticeForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.NoticeRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeServiceImpl implements NoticeService{
    @Autowired
    private NoticeRepository notiRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyRepository companyRepository;


    //공지 리스트 출력 + 검색기능
    @Override
    public Page<NoticeDto> getNoticeAll(int projNum, int page, int size,
                                        String sortField, String sortDirection,
                                        String searchType, String searchText) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.Direction.fromString(sortDirection), sortField);
        Page<NoticeEntity> noticePage;
        // 검색 텍스트가 있을 경우 searchNotices_(title, username) 메서드를 호출
        if (searchText != null && !searchText.isEmpty()) {
            if (searchType.equals("name")) {
                noticePage = notiRepository.searchNoticeUserName(projNum, searchText, pageable);
            } else if (searchType.equals("title")) {
                noticePage = notiRepository.searchNoticeTitle(projNum, searchText, pageable);
            } else {
                noticePage = notiRepository.allNoticeList(projNum, pageable);
            }
        } else {
            noticePage = notiRepository.allNoticeList(projNum, pageable);
        }
        return noticePage.map(NoticeDto::fromEntity);
    }

    //공지 하나 출력
    @Override
    public Optional<NoticeDto> getOneNotice(int notiNum) {
        return notiRepository.getOneNotice(notiNum)
                .map(NoticeDto::fromEntity);
    }

    //조회수 증가
    @Transactional
    @Override
    public void updateViewCount(int notiNum, int userPkNum) {
        NoticeEntity notice = notiRepository.findById(notiNum).orElseThrow();
        List<Integer> viewers = notice.getViewUsers();

        if (!viewers.contains(userPkNum)) {
            viewers.add(userPkNum);
            notice.setViewUsers(viewers);
            notiRepository.save(notice);
        }
    }

    // 조회수 가져오기
    /*
    @Override
    public int getViewCount(int notiNum) {
        NoticeEntity notice = notiRepository.findById(notiNum).orElseThrow();
        return notice.getViewUsers().size();
    }
     */


    //새 공지 추가
    @Transactional
    @Override
    public void addNotice(NoticeForm form) {
        NoticeEntity entity = NoticeForm.toEntity(form);
        // form에서 받은 프로젝트 ID로 프로젝트 엔티티 저장 -> 나중에 proj_name 받기
        entity.setProjectEntity(projectRepository.findById(form.getNoti_fk_proj_num()).get());
        // form에서 받은 user num으로 사용자 엔티티 저장 -> 나중에 user name 받기
        entity.setUserEntity(userRepository.findById(form.getNoti_fk_user_num()).get());
        // form에서 받은 comp num 으로 회사 엔티티 저장
        entity.setCompanyEntity(companyRepository.findById(form.getNoti_fk_comp_num()).get());
        notiRepository.save(entity);
    }

    //공지 수정
    @Transactional
    @Override
    public void upNotice(int notiNum, NoticeForm form) {
        NoticeEntity entity = notiRepository.findById(notiNum).orElseThrow();
        entity.setNotiTitle(form.getNoti_title()); //사용자 입력 제목 반영
        entity.setNotiContent(form.getNoti_content()); // 사용자 입력 내용 반영
        entity.setNotiImport(form.getNoti_import());// 사용자 입력 중요도 반영
        entity.setNotiModdate(LocalDate.now());// 수정일을 현재 날짜로 갱신
        //입력 값 확인용
        System.out.println("(공지수정)로그인 된 사용자 ID :"+entity.getUserEntity().getUserId());
        System.out.println("(공지수정)로그인 된 사용자 Name :"+entity.getUserEntity().getUserName());
        System.out.println("(공지수정)원등록일:"+entity.getNotiRegdate());
        System.out.println("(공지수정)수정등록일:"+entity.getNotiModdate());
        System.out.println("(공지수정)프로젝트 제목:"+entity.getProjectEntity().getProjTitle());
        System.out.println("(공지수정)사용자 입력 중요도:"+entity.getNotiImport());
        // 프로젝트 정보, 작성자 정보는 기존 데이터 유지
        //entity.setProjectEntity(entity.getProjectEntity());
        //entity.setUserEntity(userRepository.findById(form.getNoti_fk_user_num()).orElseThrow()); //작성자 로그인 된 작성자로 변경
        notiRepository.save(entity);// 변경 사항을 데이터베이스에 저장
    }

    //공지 임시 삭제
    @Transactional
    @Override
    public void delNotice(int notiNum) {
        notiRepository.delOneNotice(notiNum); //notiNum 기준으로 임시 삭제
    }
}
