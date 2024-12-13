package conect.service.board.notice;

import conect.data.dto.NoticeDto;
import conect.data.entity.NoticeEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.form.NoticeForm;
import conect.data.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeRepository notiRepository;

    @Autowired
    private NoticeEntity noticeEntity;

    @Autowired
    private UserEntity userEntity;

    @Autowired
    private ProjectEntity projectEntity;

    @Override
    public List<NoticeDto> getNoticeAll(int projNum) {
        return notiRepository.allNoticeList(projNum)
                .stream()
                .map(NoticeDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<NoticeDto> getOneNotice(int notiNum) {
        return notiRepository.getoneNotice(notiNum)
                .map(NoticeDto::fromEntity);
    }

    @Override
    public NoticeEntity addNotice(NoticeForm form) {
        return null;
    }

    @Override
    public NoticeDto upNotice(int notiNum, NoticeForm form) {
        return null;
    }

    @Override
    public void delNotice(int notiNum) {

    }
}
