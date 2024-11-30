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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	
	//즐겨찾기 목록 조회
	@Override
	public List<ProjectDto> getFavoriteProj(int usernum) {
		List<FavoritesDto> favorList = 
				favorRepository.findByUserEntity_userPkNum(usernum).stream().map(FavoritesDto::fromEntity).toList();
		
		List<ProjectDto> favorProjList = new ArrayList<ProjectDto>();
		
		for(FavoritesDto dto:favorList) {
			if (dto.getFavor_fk_proj_num() != null) {
				ProjectDto proj = ProjectDto.fromEntity(projRepository.findById(dto.getFavor_fk_proj_num()).get());
				favorProjList.add(proj);
			}
		}
		return favorProjList;
	}
	
	
	//즐겨찾기 목록 조회
	@Override
	public List<PostDto> getFavoritePost(int usernum) {
		List<FavoritesDto> favorList = 
				favorRepository.findByUserEntity_userPkNum(usernum).stream().map(FavoritesDto::fromEntity).toList();
		
		List<PostDto> favorPostList = new ArrayList<PostDto>();
		
		for(FavoritesDto dto:favorList) {
			if (dto.getFavor_fk_post_num() != null) {
				PostDto post = PostDto.fromEntity(postRepository.findById(dto.getFavor_fk_post_num()).get());
				favorPostList.add(post);
			}
		}
		return favorPostList;
	}
	
	//즐겨찾기 등록
	@Override
	public boolean addFavoriteData(FavoritesDto dto, String type) {
		FavoritesEntity entity = new FavoritesEntity();
		entity.setUserEntity(userRepository.findById(dto.getFavor_fk_user_num()).get());
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
}
