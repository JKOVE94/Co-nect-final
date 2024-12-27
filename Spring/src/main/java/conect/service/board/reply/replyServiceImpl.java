package conect.service.board.reply;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conect.data.dto.ReplyDto;
import conect.data.entity.ReplyEntity;
import conect.data.entity.ReplyLikesEntity;
import conect.data.form.ReplyForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ReclikesRepository;
import conect.data.repository.RecommendationRepository;
import conect.data.repository.ReplyLikesRepository;
import conect.data.repository.ReplyRepository;
import conect.data.repository.UserRepository;
import conect.service.ResourceNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class replyServiceImpl implements replyService{
	
	@Autowired
	private RecommendationRepository recRepository;
	@Autowired
	private ReplyRepository replyRepository;
	@Autowired
	private ReplyLikesRepository replyLikesRepository;
	@Autowired
	private UserRepository userRepository;
	
	//모든 댓글
	@Override
	public List<ReplyDto> getReplyAll(int recNum) {
		//그룹번호, 댓글 깊이(댓글,대댓글 구분용), 작성일자 정렬
		try {
			List<ReplyDto> dto = replyRepository.findByRecommendationEntity_RecPkNumOrderByReplyParentDescReplyDepthAscReplyRegdateDesc(recNum)
					.stream().map(ReplyDto::fromEntity).toList();
			return dto;
		} catch (Exception e) {
            throw new RuntimeException("Error removing recommendation like: " + e.getMessage(), e);
        }
	}
	
	//댓글 등록
	@Override
	@Transactional
	public void addRecReply(ReplyForm bean) {
		try {
			ReplyEntity entity = ReplyForm.toEntity(bean);
			entity.setReplyRegdate(LocalDateTime.now()); //작성일자는 현재 일자
			entity.setRecommendationEntity(recRepository.findById(bean.getReply_fk_rec_num())
					.orElseThrow(() -> new ResourceNotFoundException("건의사항을 찾을 수 없습니다. 건의사항 번호 : " + bean.getReply_fk_rec_num())));
            entity.setUserEntity(userRepository.findById(bean.getReply_fk_user_num())
            		.orElseThrow(() -> new ResourceNotFoundException("사원을 찾을 수 없습니다. 사원 번호 : " + bean.getReply_fk_user_num())));

			//대댓글일 경우 댓글의 그룹번호, 댓글일 경우 null
			if (bean.getReply_parent() > 0) {
				//대댓글 그룹번호는 댓글의 그룹번호로 저장
			    entity.setReplyParent(bean.getReply_parent());
			} else {
				
				// 댓글 등록 시 그룹 번호(replyParent)를 설정
				// - 댓글이 없을 경우: 그룹 번호를 1로 설정
				// - 댓글이 존재할 경우: 가장 큰 그룹 번호 + 1로 설정하여 새로운 그룹 생성
				replyRepository.findTopByOrderByReplyParentDesc().ifPresentOrElse(
                        topReply -> entity.setReplyParent(topReply.getReplyParent() + 1),
                        () -> entity.setReplyParent(1));
			}
			replyRepository.save(entity);
		
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	//댓글 수정
	@Override
	public ReplyDto editReply(ReplyForm bean) {
		try {
			ReplyEntity entity = ReplyForm.toEntity(bean);
			
			entity.setRecommendationEntity(recRepository.findById(bean.getReply_fk_rec_num())
					.orElseThrow(() -> new ResourceNotFoundException("건의사항을 찾을 수 없습니다. 건의사항 번호 : " + bean.getReply_fk_rec_num())));
            entity.setUserEntity(userRepository.findById(bean.getReply_fk_user_num())
            		.orElseThrow(() -> new ResourceNotFoundException("사원을 찾을 수 없습니다. 사원 번호 : " + bean.getReply_fk_user_num())));
			
			ReplyDto dto = ReplyDto.fromEntity(replyRepository.save(entity));
			return dto;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}
		
	}
	
	//댓글 삭제
	@Override
	@Transactional
	public void dropReply(int replyNum) {
		try {
			ReplyDto dto = ReplyDto.fromEntity(replyRepository.findById(replyNum)
					.orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다. 댓글번호 : " + replyNum)));
			//댓글 좋아요 정보 삭제
			replyLikesRepository.deleteByReplyEntity_ReplyPkNum(replyNum);
			
			if(dto.getReply_depth() == 0) {
				//댓글 일 경우 모든 그룹 삭제
				replyRepository.deleteByReplyParent(dto.getReply_parent());
			} else {
				//대댓글일 경우 해당 글만 삭제
				replyRepository.deleteById(replyNum);
			}
			
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	//로그인한 유저가 댓글 좋아요 눌렀는지 확인
	@Override
	public boolean checkReplylike(int userNum, int replyNum) {
		try {
			if (replyLikesRepository
					.findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(userNum, replyNum) != null) {
				return true;
			}
			return false;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	//댓글 좋아요 등록
	@Override
	public void addReplylike(int userNum, int replyNum) {
        try {
            ReplyLikesEntity entity = new ReplyLikesEntity();
            entity.setUserEntity(userRepository.findById(userNum).orElseThrow(() -> new ResourceNotFoundException("사원을 찾을 수 없습니다. 사원 번호 : " + userNum)));
            entity.setReplyEntity(replyRepository.findById(replyNum).orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다. 댓글번호 : " + replyNum)));
            replyLikesRepository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
	
	//댓글 좋아요 삭제
	@Override
	public void dropReplylike(int usernum, int replynum) {
		try {
			ReplyLikesEntity entity = replyLikesRepository.
					findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(usernum, replynum);
			if(entity != null) {
				replyLikesRepository.deleteById(entity.getReplylikePkNum());
			} else {
				throw new ResourceNotFoundException("일치하는 데이터가 없습니다.");
			}
			
		} catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }	
	}
}
