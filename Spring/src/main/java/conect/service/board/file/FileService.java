package conect.service.board.file;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;

import conect.data.dto.FileDto;
import conect.data.dto.PostDto;
import conect.data.entity.FileEntity;
import conect.data.form.FileForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface FileService {
	// 삽입
	FileEntity insertPost(FileForm fileForm);

	// 전체 조회
	List<FileDto> getPostAll();

	// 부분 조회 및 조회수 증가
	public FileDto getPostView(Integer filePkNum, HttpServletRequest request, HttpServletResponse response);

	// 수정
	FileDto updatePost(int filePkNum, FileForm fileForm);

	// 삭제
	void deletePost(int filePkNum);

	// 페이징
	public Page<FileDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

	// 파일 저장 메소드
	public String saveFile(FileForm form) throws IOException; 
}
