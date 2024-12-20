package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.naming.Name;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Setter
@Getter
@Entity
@Table(name="notice")
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notiPkNum; //공지사항 고유번호 [PK, INT]
    private String notiTitle; //공지사항 제목 [VARCHAR]
    private String notiContent; //공지사항 내용 [VARCHAR]
    private LocalDate notiRegdate; //공지사항 등록일 [DATETIME]
    private LocalDate notiModdate; //공지사항 수정일 [DATETIME]
    private int notiDeleted; //공지사항 삭제여부 [INT]
    private int notiImport; //공지사항 중요도 [INT]
    private String noti_view;//조회수

    // getter에서 String을 List로 변환
    public List<Integer> getViewUsers() {
        if (noti_view == null || noti_view.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(noti_view.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }

    // setter에서 List를 String으로 변환
    public void setViewUsers(List<Integer> users) {
        this.noti_view = users.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }


    @ManyToOne
    @JoinColumn(name = "noti_fk_user_num")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "noti_fk_proj_num")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn(name = "noti_fk_comp_num")
    private CompanyEntity companyEntity;

}
