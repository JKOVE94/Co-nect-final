import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import FileSearch from "variables/Search/FileSearch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("wikiEntity.wikiRegdate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(false);

  const compPkNum = useSelector((state) => state.userData?.user_fk_comp_num);
  const projPkNum = useSelector((state) => state.userData?.user_fk_proj_num);

  const navigate = useNavigate();

  const fetchFiles = async (page, block, sortField, sortDirection, searchType, searchText) => {
    if (!compPkNum || !projPkNum) {
      console.error("회사 번호 또는 프로젝트 번호가 유효하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching files with params:", { page, block, sortField, sortDirection, searchType, searchText });

      const response = await axios.get(`/${compPkNum}/file/${projPkNum}`, {
        params: {
          page,
          pageBlock: block,
          sortField,
          sortDirection,
          searchType,
          searchText,
        },
      });

      const { files, currentPage, totalPages, totalBlocks } = response.data;

      if (Array.isArray(files)) {
        setFiles(files);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setTotalBlocks(totalBlocks);
      } else {
        console.error("응답 데이터가 배열이 아닙니다.");
      }
    } catch (error) {
      console.error("파일을 불러오는 중 오류 발생:", error);
      toast.error("파일을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
  }, [compPkNum, projPkNum, sortField, sortDirection, searchType, searchText]);

  const toggleModal = (file = null) => {
    setSelectedFile(file);
    setIsModalOpen(!isModalOpen);
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      toast.error("다운로드할 파일이 선택되지 않았습니다.");
      return;
    }

    try {
      const { filePkNum, fileName } = selectedFile;

      const response = await axios.get(`/${compPkNum}/file/${projPkNum}/download/${filePkNum}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", decodeURIComponent(fileName));
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("파일 다운로드가 완료되었습니다!");
      toggleModal();
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
      toast.error("파일을 다운로드하는 중 오류가 발생했습니다.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFiles(pageNumber, pageBlock, sortField, sortDirection, searchType, searchText);
  };

  const handleSortChange = (field) => {
    const newDirection = sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleSearch = () => {
    fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container fluid style={{ marginTop: "1em" }}>
      <ToastContainer autoClose={2000} hideProgressBar />
      <Card style={{ height: "45em", position: "relative" }}>
        <CardHeader>
          <h2>파일 게시판</h2>
          <FileSearch
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
          />
        </CardHeader>
        <CardBody style={{ height: "calc(100% - 4em)", overflowY: "hidden" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>파일 제목</th>
                <th>작성자</th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSortChange("wikiEntity.wikiRegdate")}
                >
                  작성일 {sortField === "wikiEntity.wikiRegdate" && (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSortChange("wikiView")}
                >
                  조회수 {sortField === "wikiView" && (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.file_pk_num}>
                    <td>{file.file_pk_num}</td>
                    <td>
                      <Link to={`/main/file/detail/${file.file_pk_num}`}>{file.file_name}</Link>
                    </td>
                    <td>{file.wiki.user_name}</td>
                    <td>{format(new Date(file.wiki.wiki_regdate), "yyyy-MM-dd")}</td>
                    <td>{file.wiki.wiki_view}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">파일이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileList;
