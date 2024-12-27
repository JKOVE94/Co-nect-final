package conect.service.board.favor;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import conect.data.dto.FavoritesDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;

public interface FavorService {

	//즐겨찾기 조회 - 프로젝트
	Page<Object> getFavoriteProj(int usernum, int page, int size);

	//즐겨찾기 조회 - 자유게시글
	Page<Object> getFavoritePost(int usernum, int page, int size);

	//즐겨찾기 등록 조회
	Optional<FavoritesDto> checkFavorite(String type, int usernum, int num);

	//즐겨찾기 등록
	boolean addFavoriteData(FavoritesDto dto, String type);

	//즐겨찾기 삭제
	boolean dropFavoriteData(int num);

	//즐겨찾기 삭제(post/proj pk num 전달 시)
	boolean dropFavoriteDataAsPk(String type, int usernum, int pknum);
}