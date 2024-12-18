package conect.service.board.recommendation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.entity.ReclikesEntity;
import conect.data.entity.RecommendationEntity;
import conect.data.form.RecommendationForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ReclikesRepository;
import conect.data.repository.RecommandationRepository;
import conect.data.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class recommendationServiceImpl implements recommendationService {

	@Autowired
	private RecommandationRepository recRepository;
	@Autowired
	private ReclikesRepository reclikesRepository;
	@Autowired
	private ProjectRepository projRepository;
	@Autowired
	private UserRepository userRepository;
	
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
			entity.setRecRegdate(LocalDate.now());
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
			entity.setRecRegdate(LocalDate.now());
			
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
}
