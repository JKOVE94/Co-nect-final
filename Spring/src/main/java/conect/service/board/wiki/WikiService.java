package conect.service.board.wiki;

import java.util.List;

import org.springframework.data.domain.Page;

import conect.data.dto.ProjectDto;
import conect.data.dto.WikiDto;
import conect.data.form.WikiForm;

public interface WikiService {

	// 검색
	//Set<String> getStatusAll(int compNum);
	//List<ProjectDto> getSearchData(String status, String title);

	// 전체 목록 불러오기
	List<WikiDto> getListAll();
	
	// 페이징, 정렬, 검색
	Page<WikiDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

	WikiDto getWikiById(int wikiPkNum);
	
	// 문서 생성
	int addWiki(WikiForm form);

	// 문서 수정
	void editWiki(int wikiPkNum, WikiForm form);
	
	void deleteWiki(int wikiPkNum);

}
