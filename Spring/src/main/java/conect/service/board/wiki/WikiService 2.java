package conect.service.board.wiki;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.ProjectDto;
import conect.data.dto.WikiDto;
import conect.data.entity.WikiEntity;
import conect.data.form.WikiForm;

public interface WikiService {

	String saveFile(WikiForm form) throws IOException;

	// 전체 목록 불러오기
	List<WikiDto> getListAll();
	
	// 페이징, 정렬, 검색
	Page<WikiDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

	WikiDto getWikiById(int wikiPkNum);
	
	// 문서 생성
	int addWiki(WikiForm form)  throws Exception ;

	// 문서 수정
	void editWiki(int wikiPkNum, WikiForm form);
	
	void deleteWiki(int wikiPkNum);

	int addWikiEntity(String wikiTitle, String wikiContent, Integer userNum, Integer projNum, boolean wikiNotice);

}
