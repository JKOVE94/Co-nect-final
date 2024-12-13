package conect.service.board.recommendation;

import java.util.List;

import conect.data.dto.RecommendationDto;

public interface recommendationService {

	List<RecommendationDto> getRecAll(int num);
}
