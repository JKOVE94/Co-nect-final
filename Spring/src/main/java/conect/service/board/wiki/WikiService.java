package conect.service.board.wiki;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.WikiDto;
import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.WikiForm;

public interface WikiService {

	String saveFile(WikiForm form) throws IOException;
	
	// 페이징, 정렬, 검색
	Page<WikiDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);
	
	WikiDto getWikiById(int wikiPkNum);
	
	// 문서 생성
	int addWiki(WikiForm form) throws Exception;

	// 문서 수정
	void editWiki(int filePkNum, MultipartFile file, int wikiPkNum, WikiForm form) throws Exception;
	
	void deleteFile(FileEntity fileEntity);
	
	//void deleteWiki(int wikiPkNum);

}
