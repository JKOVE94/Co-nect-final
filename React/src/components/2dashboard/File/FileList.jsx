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
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";

const FileList = (props) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호
  const projNum = sessionStorage.getItem("persist:proj_pk_num");
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

  const navigate = useNavigate();

  const fetchFiles = (
    page,
    block,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    // console.log("회사 번호(compNum):", compNum);
    // console.log("프로젝트 번호(projNum):", projNum);
    if (!compNum || !projNum) {
      toast.error("회사 번호 또는 프로젝트 번호가 설정되지 않았습니다.");
      return;
    }
    axiosInstance
      .get(`/conect/${compNum}/file/${props.projPkNum}`, {
        params: {
          page,
          pageBlock: block,
          sortField,
          sortDirection,
          searchType,
          searchText,
        },
      })
      .then((res) => {
        const { files, currentPage, totalPages, totalBlocks } = res.data;
        if (Array.isArray(files)) {
          setFiles(files);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setTotalBlocks(totalBlocks);
          // console.log("API 호출 성공:", res.data);
        } else {
          console.error("파일 목록이 배열이 아닙니다.");
        }
      })
      .catch((error) => {
        console.error("파일을 불러오는 중 오류 발생:", error);
      });
  };

  const toggleModal = (file = null) => {
    setSelectedFile(file);
    setIsModalOpen(!isModalOpen);
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      toast.error("다운로드할 파일이 선택되지 않았습니다.");
      return;
    }

    const { filePkNum, fileName } = selectedFile;
    try {
      const response = await axiosInstance.get(
        `/conect/${compNum}/file/${projNum}/download/${filePkNum}`,
        {
          responseType: "blob",
        }
      );

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
      console.error("파일 다운로드 중 오류:", error);
      toast.error("파일을 다운로드하는 중 오류가 발생했습니다.");
    }
  };

  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock;
  const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages);

  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock },
    (_, index) => startPageOfBlock + index
  );

  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction;
    setPageBlock(newPageBlock);
    fetchFiles(newPageBlock * pagesPerBlock, newPageBlock);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFiles(pageNumber, Math.floor(pageNumber / pagesPerBlock));
  };

  useEffect(() => {
    fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
  }, [projNum, sortField, sortDirection]);

  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");

  const handleSortChange = (field) => {
    const newDirection =
      sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field);
    setSortDirection(newDirection);
    fetchFiles(
      currentPage,
      pageBlock,
      field,
      newDirection,
      searchType,
      searchText
    );
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) handleSearch();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "type") {
      setSearchType(value);
    } else if (id === "search") {
      setSearchText(value.trim());
    }
  };

  const handleSearch = () => {
    if (searchType) {
      fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
    }
  };

  useEffect(() => {
    // console.log("props.projPkNum : ", props.projPkNum);
  }, [props.projPkNum]);

  return (
    <Container fluid style={{ marginTop: "1em" }}>
      <ToastContainer autoClose={2000} hideProgressBar />
      <Card style={{ height: "45em", position: "relative" }}>
        <CardHeader>
          <h2>파일 게시판</h2>
          <FileSearch
            value={searchText}
            onChange={handleChange}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </CardHeader>
        <CardBody style={{ height: "calc(100% - 4em)", overflowY: "hidden" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>파일제목</th>
                <th>작성자</th>
                <th
                  onClick={() => handleSortChange("wikiEntity.wikiRegdate")}
                  style={{ cursor: "pointer" }}
                >
                  작성일
                  {sortField === "wikiEntity.wikiRegdate" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  onClick={() => handleSortChange("wikiView")}
                  style={{ cursor: "pointer" }}
                >
                  조회수
                  {sortField === "wikiView" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr
                    key={file.file_pk_num}
                    style={{
                      backgroundColor: file.wiki.wiki_isnotice
                        ? "#f0f0f0"
                        : "transparent",
                    }}
                  >
                    <td>{file.file_pk_num}</td>
                    <td>
                      <Link to={`/main/file/detail/${file.file_pk_num}`}>
                        {file.wiki.wiki_isnotice && (
                          <span
                            style={{
                              color: "goldenrod",
                              marginRight: "0.5em",
                              display: "inline-block",
                            }}
                          >
                            <i className="fas fa-bell"></i>
                          </span>
                        )}
                        {file.file_name}
                      </Link>
                      <span
                        title="파일 다운로드"
                        style={{
                          cursor: "pointer",
                          marginLeft: "0.5em",
                          color: "blue",
                        }}
                        onClick={() =>
                          toggleModal({
                            filePkNum: file.file_pk_num,
                            fileName: file.file_name,
                          })
                        }
                      >
                        📥
                      </span>
                    </td>
                    <td>{file.wiki.user_name}</td>
                    <td>{formatDate(file.wiki.wiki_regdate)}</td>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1em",
            }}
          >
            <button
              className={`btn btn-link ${pageBlock === 0 ? "disabled" : ""}`}
              onClick={() => pageBlock > 0 && handlePageBlockChange(-1)}
              disabled={pageBlock === 0}
            >
              &laquo; 이전
            </button>

            {pageButtons.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              className={`btn btn-link ${
                pageBlock + 1 >= totalBlocks ? "disabled" : ""
              }`}
              onClick={() =>
                pageBlock + 1 < totalBlocks && handlePageBlockChange(1)
              }
              disabled={pageBlock + 1 >= totalBlocks}
            >
              다음 &raquo;
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{ position: "absolute", bottom: "2em", right: "2em" }}
            onClick={() => navigate("/main/file/create")}
          >
            파일 업로드
          </button>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} toggle={toggleModal} backdrop="static">
        <ModalHeader toggle={toggleModal}>파일 다운로드</ModalHeader>
        <ModalBody>
          {selectedFile
            ? `"${selectedFile.fileName}" 파일을 다운로드 하시겠습니까?`
            : "파일이 선택되지 않았습니다."}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDownload}>
            다운로드
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FileList;
