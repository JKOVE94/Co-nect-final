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
import java.util.stream.Collectors;

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


    //조회수 증가

    @Override
    public void updateCount(int notiNum) {
        notiRepository.updateCount(notiNum);
    }


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
        System.out.println(entity.getNotiRegdate());
        System.out.println(entity.getProjectEntity().getProjTitle());
        // 수정일을 현재 날짜로 갱신
        entity.setNotiModdate(LocalDate.now());
        // 프로젝트 정보와 작성자 정보는 기존 데이터 유지
        //entity.setProjectEntity(entity.getProjectEntity());
        //entity.setUserEntity(entity.getUserEntity());
        // 변경 사항을 데이터베이스에 저장
        notiRepository.save(entity);
    }

    //공지 임시 삭제
    @Transactional
    @Override
    public void delNotice(int notiNum) {
        notiRepository.delOneNotice(notiNum); //notiNum 기준으로 임시 삭제
    }
}
