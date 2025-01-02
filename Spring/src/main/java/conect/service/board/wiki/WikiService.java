package conect.service.board.wiki;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.WikiDto;
import conect.data.entity.FileEntity;
import conect.data.form.WikiForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface WikiService {

	String saveFile(WikiForm form) throws Exception;

	// 전체 목록 불러오기
	List<WikiDto> getListAll();
	
	// 페이징, 정렬, 검색
	Page<WikiDto> getList(int projPkNum, int page, int pageSize, String sortField, String sortDirection, String searchType,
			String searchText);
	
	WikiDto getPostView(Integer wikiPkNum, HttpServletRequest request, HttpServletResponse response);
	
	void incrementViewCount(Integer wikiPkNum);
	
	FileEntity getWikiFileByWikiNum(int wikiPkNum);
	
	// 문서 생성
	int addWiki(WikiForm form) throws Exception ;

	// 문서 수정
	void editWiki(int wikiPkNum, WikiForm form) throws Exception;
	
	//void handleFileOperations(WikiForm form, WikiEntity savedEntity) throws Exception;
	
	void deleteFile(int filePkNum);
	
	void deleteWiki(int wikiPkNum);

	int addWikiEntity(String wikiTitle, String wikiContent, Integer userNum, Integer projNum, boolean wikiNotice);

}
