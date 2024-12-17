package conect.service.Notice;
import conect.data.dto.NoticeDto;
import conect.data.entity.NoticeEntity;
import conect.data.form.NoticeForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.NoticeRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    //공지 리스트 출력
    @Override
    public List<NoticeDto> getNoticeAll(int projNum) {
        return notiRepository.allNoticeList(projNum)
                .stream()
                .map(NoticeDto::fromEntity)
                .collect(Collectors.toList());
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
        // 등록일을 현재 날짜로 갱신
        //entity.setNotiRegdate(LocalDate.now());
        // 프로젝트 정보와 작성자 정보는 기존 데이터 유지
        //entity.setProjectEntity(entity.getProjectEntity());
        //entity.setUserEntity(entity.getUserEntity());
        // 변경 사항을 데이터베이스에 저장
        notiRepository.save(entity);
    }

    //공지 임시 삭제
    @Override
    public void delNotice(int notiNum) {
        notiRepository.delOneNotice(notiNum); //notiNum 기준으로 임시 삭제
    }
}
