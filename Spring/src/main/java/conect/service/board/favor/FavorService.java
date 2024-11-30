package conect.service.board.favor;

import java.util.List;

import conect.data.dto.FavoritesDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;

public interface FavorService {
	
	//즐겨찾기 조회 - 프로젝트
	List<ProjectDto> getFavoriteProj(int usernum);
	
	//즐겨찾기 조회 - 자유게시글
	List<PostDto> getFavoritePost(int usernum);
	
	//즐겨찾기 등록
	boolean addFavoriteData(FavoritesDto dto, String type);
	
	//즐겨찾기 삭제
	boolean dropFavoriteData(int num);
}
