package conect.service.board.file;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.FileDto;
import conect.data.dto.PostDto;
import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.FileForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface FileService {
	// 파일 저장 메소드
	public String saveFile(FileForm form, MultipartFile file) throws IOException;

	// 삽입
	FileEntity insertPost(MultipartFile file, FileForm fileForm) throws IOException;

	// 전체 조회
	public List<FileDto> getPostAll();

	// 부분 조회
	public FileDto getPostView(Integer filePkNum, HttpServletRequest request, HttpServletResponse response);

	// 수정
	public FileDto updatePost(int filePkNum, MultipartFile file, String wikiTitle, String wikiContent,
			boolean wikiIsnotice);

	// 삭제
	void deletePost(int filePkNum);

	// 페이징, 정렬
	public Page<FileDto> getList(Integer compNum, Integer projNum, int page, int pageSize, String sortField, String sortDirection, String searchType,
			String searchText);
}
