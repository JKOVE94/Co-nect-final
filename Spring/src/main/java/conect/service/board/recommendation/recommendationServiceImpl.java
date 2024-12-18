package conect.service.board.recommendation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import conect.data.dto.RecommendationDto;
import conect.data.repository.RecommandationRepository;

@Service
public class recommendationServiceImpl implements recommendationService {

	@Autowired
	private RecommandationRepository recRepository;
	
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
}
