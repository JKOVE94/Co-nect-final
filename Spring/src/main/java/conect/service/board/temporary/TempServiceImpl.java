//package conect.service.board.temporary;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import conect.data.dto.TemporaryDto;
//import conect.data.entity.PostEntity;
//import conect.data.form.PostForm;
//import conect.data.repository.PostRepository;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class TempServiceImpl implements TempService {
//
//    @Autowired
//    private PostRepository postRepository;
//
//    // 임시 저장
//    @Override
//    public PostEntity saveTemporary(PostForm postForm) {
//        PostEntity postEntity = new PostEntity();
//        postEntity.setPostKind(postForm.getPost_kind());
//        postEntity.setPostTargetnum(postForm.getPost_targetnum());
//        postEntity.setPostName(postForm.getPost_name());
//        postEntity.setPostRegdate(postForm.getPost_regdate());
//        postEntity.setPostImport(postForm.getPost_import());
//        postEntity.setPostContent(postForm.getPost_content());
//        postEntity.setPostTag(postForm.getPost_tag());
//        postEntity.setPostDepth(postForm.getPost_depth());
//        postEntity.setPostView(postForm.getPost_view());
//        postEntity.setPostTemp(1); // 임시 저장된 게시글로 설정
//        // 임시 저장 시 사용자와 회사 설정
//        // userEntity와 companyEntity는 필요한 경우 설정합니다.
//        return postRepository.save(postEntity);
//    }
//
//    // 임시 저장된 게시글 조회
//    @Override
//    public List<TemporaryDto> getAllTemporary() {
//        // 레포지토리의 필터링 메서드를 활용
//        return postRepository.findByPostTemp(1).stream()
//                .map(TemporaryDto::fromEntity)
//                .collect(Collectors.toList());
//    }
//
//    // 임시 저장된 게시글 삭제
//    @Override
//    public void deleteTemporary(int postPkNum) {
//        postRepository.deleteTemporaryById(postPkNum);
//    }
//}