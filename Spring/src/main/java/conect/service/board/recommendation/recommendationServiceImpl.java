package conect.service.board.recommendation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.hibernate.grammars.hql.HqlParser.IsNullPredicateContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.protobuf.Value;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.entity.ReclikesEntity;
import conect.data.entity.RecommendationEntity;
import conect.data.entity.ReplyEntity;
import conect.data.entity.ReplyLikesEntity;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ReclikesRepository;
import conect.data.repository.RecommendationRepository;
import conect.data.repository.ReplyLikesRepository;
import conect.data.repository.ReplyRepository;
import conect.data.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class recommendationServiceImpl implements recommendationService {

	@Autowired
	private RecommendationRepository recRepository;
	@Autowired
	private ReclikesRepository reclikesRepository;
	@Autowired
	private ProjectRepository projRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ReplyRepository replyRepository;
	@Autowired
	private ReplyLikesRepository replyLikesRepository;
	
	@Override
	public List<RecommendationDto> getRecAll(int num) {	
		try {
			List<RecommendationDto> list =
					recRepository.findByProjectEntity_projPkNum(num)
					.stream().map(RecommendationDto::fromEntity).toList();
			return list;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	@Override
	public void addRecData(RecommendationForm bean) {
		try {
			RecommendationEntity entity = RecommendationForm.toEntity(bean);
			entity.setProjectEntity(projRepository.findById(bean.getRec_fk_proj_num()).get());
			entity.setUserEntity(userRepository.findById(bean.getRec_fk_user_num()).get());
			entity.setRecRegdate(LocalDateTime.now());
			recRepository.save(entity);
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	@Override
	public RecommendationDto getRecData(int projNum, int recNum) {
		try {
			RecommendationDto dto = 
					RecommendationDto.fromEntity(recRepository.findByProjectEntity_projPkNumAndRecPkNum(projNum, recNum));
			return dto;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	@Override
	public RecommendationDto updateRecData(int recNum, RecommendationForm bean) {
		try {
			RecommendationEntity entity = RecommendationForm.toEntity(bean);
			entity.setProjectEntity(projRepository.findById(bean.getRec_fk_proj_num()).get());
			entity.setUserEntity(userRepository.findById(bean.getRec_fk_user_num()).get());
			
			RecommendationEntity result = recRepository.save(entity);
			return RecommendationDto.fromEntity(result);
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	@Override
	@Transactional
	public void delRecData(int recPkNum) {
		try {
			reclikesRepository.deleteByRecommendationEntity_RecPkNum(recPkNum);
			recRepository.deleteById(recPkNum);
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	@Override
	public boolean checkReclike(int usernum, int recnum) {
		if (reclikesRepository
				.findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(usernum, recnum) != null) {
			return true;
		}
				
		return false;
	}
	@Override
	public void addReclike(int usernum, int recnum) {
		ReclikesEntity entity = new ReclikesEntity();
		entity.setUserEntity(userRepository.findById(usernum).get());
		entity.setRecommendationEntity(recRepository.findById(recnum).get());
		reclikesRepository.save(entity);
	}
	
	@Override
	public void delReclike(int usernum, int recnum) {
		ReclikesEntity entity = reclikesRepository.findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(usernum, recnum);
		reclikesRepository.deleteById(entity.getReclikePkNum());
	}
	
	@Override
	@Transactional
	public void addRecReply(ReplyForm bean) {
		try {
			ReplyEntity entity = ReplyForm.toEntity(bean);
			entity.setReplyRegdate(LocalDateTime.now());
			entity.setRecommendationEntity(recRepository.findById(bean.getReply_fk_rec_num()).get());
			entity.setUserEntity(userRepository.findById(bean.getReply_fk_user_num()).get());
			Integer parentNum = bean.getReply_parent();

			if (parentNum > 0) {
			    entity.setReplyParent(parentNum);
			} else {
			    replyRepository.findTopByOrderByReplyParentDesc().ifPresentOrElse(
			        reply -> {
			            entity.setReplyParent(reply.getReplyParent() + 1);
			        },
			        () -> {
			            entity.setReplyParent(1);
			        }
			    );
			}
			replyRepository.save(entity);
		
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	@Override
	public List<ReplyDto> getReplyAll(int num) {
		
		return replyRepository.findByRecommendationEntity_RecPkNumOrderByReplyParentAscReplyRegdateAsc(num)
				.stream().map(ReplyDto::fromEntity).toList();
	}
	
	@Override
	public void addReplylike(int usernum, int replynum) {
		ReplyLikesEntity entity = new ReplyLikesEntity();
		entity.setUserEntity(userRepository.findById(usernum).get());
		entity.setReplyEntity(replyRepository.findById(replynum).get());
		replyLikesRepository.save(entity);
		
	}
	
	@Override
	public boolean checkReplylike(int usernum, int replynum) {
		if (replyLikesRepository
				.findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(usernum, replynum) != null) {
			return true;
		}
		return false;
	}
	
	@Override
	public void delReplylike(int usernum, int replynum) {
		ReplyLikesEntity entity = replyLikesRepository.findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(usernum, replynum);
		replyLikesRepository.deleteById(entity.getReplylikePkNum());
		
	}
	
	@Override
	@Transactional
	public void delReplyData(int replyPkNum) {
		try {
			replyLikesRepository.deleteByReplyEntity_ReplyPkNum(replyPkNum);
			replyRepository.deleteById(replyPkNum);
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	@Override
	public ReplyDto updateReplyData(ReplyForm bean) {
		ReplyEntity entity = ReplyForm.toEntity(bean);
		entity.setUserEntity(userRepository.findById(bean.getReply_fk_user_num()).get());
		entity.setRecommendationEntity(recRepository.findById(bean.getReply_fk_rec_num()).get());
		ReplyDto dto = ReplyDto.fromEntity(replyRepository.save(entity));
		return dto;
	}
}
