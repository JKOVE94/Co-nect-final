package conect.service.board.favor;

import conect.data.dto.FavoritesDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.entity.FavoritesEntity;
import conect.data.repository.FavoritesRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class FavorServiceImpl implements FavorService {

	@Autowired
	private ProjectRepository projRepository;
	@Autowired
	private FavoritesRepository favorRepository;
	@Autowired
	private PostRepository postRepository;
	@Autowired
	private UserRepository userRepository;

	//즐겨찾기 목록 - 프로젝트
	@Override
	public Page<Object> getFavoriteProj(int usernum, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);

		Page<FavoritesDto> favorList =
				favorRepository.findByUserEntity_UserPkNumAndProjectEntityIsNotNullOrderByProjectEntity_ProjPkNumAsc(usernum, pageable)
						.map(FavoritesDto::fromEntity);

		ObjectMapper objectMapper = new ObjectMapper();
		//날짜(regdate)를 long으로 변환하는 것을 막기 위한 코드
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

		List<Map<String, Object>> list = new ArrayList<>();

		for(FavoritesDto dto:favorList) {
			//조회된 즐겨찾기 목록에서 proj num이 null이 아닌 경우 proj 정보를 가져오기
			if (dto.getFavor_fk_proj_num() != null) {
				//proj 정보가 있을 경우 list에 담아주기
				projRepository.findById(dto.getFavor_fk_proj_num()).ifPresent(projEntity -> {
					ProjectDto proj = ProjectDto.fromEntity(projEntity);
					// ProjectDto를 Map으로 변환
					Map<String, Object> map = objectMapper.convertValue(proj, Map.class);
					map.put("favor_id", dto.getFavor_id());
					list.add(map);
				});
			}
		}
		return new PageImpl(list, pageable, favorList.getTotalElements());
	}

	//즐겨찾기 목록 - 자유게시글
	@Override
	public Page<Object> getFavoritePost(int usernum, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);

		Page<FavoritesDto> favorList =
				favorRepository.findByUserEntity_UserPkNumAndPostEntityIsNotNullOrderByPostEntity_PostPkNumAsc(usernum, pageable)
						.map(FavoritesDto::fromEntity);

		ObjectMapper objectMapper = new ObjectMapper();
		//날짜(regdate)를 long으로 변환하는 것을 막기 위한 코드
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

		List<Map<String, Object>> list = new ArrayList<>();

		for(FavoritesDto dto:favorList) {
			//조회된 즐겨찾기 목록에서 proj num이 null이 아닌 경우 proj 정보를 가져오기
			if (dto.getFavor_fk_post_num() != null) {
				//proj 정보가 있을 경우 list에 담아주기
				postRepository.findById(dto.getFavor_fk_post_num()).ifPresent(postEntity -> {
					PostDto post = PostDto.fromEntity(postEntity);
					// ProjectDto를 Map으로 변환
					Map<String, Object> map = objectMapper.convertValue(post, Map.class);
					map.put("favor_id", dto.getFavor_id());
					list.add(map);
				});
			}
		}
		return new PageImpl(list, pageable, favorList.getTotalElements());
	}

	//즐겨찾기에 등록된 글인지 확인 (Read용)
	@Override
	public Optional<FavoritesDto> checkFavorite(String type, int usernum, int num) {
		try {
			if(type.equalsIgnoreCase("proj")) {
				FavoritesEntity entity = favorRepository.findByUserEntity_userPkNumAndProjectEntity_projPkNum(usernum, num);
				return Optional.of(FavoritesDto.fromEntity(entity));
			} else if (type.equalsIgnoreCase("post")) {
				FavoritesEntity entity = favorRepository.findByUserEntity_userPkNumAndPostEntity_postPkNum(usernum, num);
				return Optional.of(FavoritesDto.fromEntity(entity));
			} else {
				throw new Error();
			}
		} catch(Exception e) {
			return Optional.empty();
		}

	}

	//즐겨찾기 등록
	@Override
	public boolean addFavoriteData(FavoritesDto dto, String type) {
		FavoritesEntity entity = new FavoritesEntity();
		entity.setUserEntity(userRepository.findById(dto.getFavor_fk_user_num()).get());

		//넘겨준 type이 post라면 post num을, proj라면 proj num 을 세팅
		if(type.equalsIgnoreCase("post")) {
			entity.setPostEntity(postRepository.findById(dto.getFavor_fk_post_num()).get());
		} else if(type.equalsIgnoreCase("proj")){
			entity.setProjectEntity(projRepository.findById(dto.getFavor_fk_proj_num()).get());
		}

		try {
			favorRepository.save(entity);
			return true;
		} catch(Exception e) {
			return false;
		}
	}

	//즐겨찾기 삭제
	@Override
	public boolean dropFavoriteData(int num) {
		try {
			favorRepository.deleteById(num);
			return true;
		} catch(Exception e) {
			return false;
		}
	}

	//즐겨찾기 삭제(post/proj pk num 전달 시)
	@Override
	public boolean dropFavoriteDataAsPk(String type, int usernum, int pknum) {
		int num=0;

		if(type.equalsIgnoreCase("post")) {
			num = favorRepository.findByUserEntity_userPkNumAndPostEntity_postPkNum(usernum,pknum).getFavorId();
		} else if(type.equalsIgnoreCase("proj")){
			num = favorRepository.findByUserEntity_userPkNumAndProjectEntity_projPkNum(usernum, pknum).getFavorId();
		}
		try {
			favorRepository.deleteById(num);
			return true;
		} catch(Exception e) {
			return false;
		}
	}
}