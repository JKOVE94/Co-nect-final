import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Progress,
    Table,
    Container,
    Row,
    Pagination,
    PaginationItem,
    PaginationLink,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "reactstrap";
import { debounce } from "lodash";
import FavorCheck from "../Favorite/FavorCheck";
import { useSelector } from "react-redux";
import ProjSearch from "variables/Search/ProjSearch";

const ProjectTable = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("전체");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchHandle = useCallback(() => {
        setLoading(true);
        axios
            .get("/proj/projlist", {
                params: {
                    filter,
                    searchTerm,
                    page: currentPage,
                },
            })
            .then((res) => {
                setProjects(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [filter, searchTerm, currentPage]);

    // Initialize the page from URL params on load
    useEffect(() => {
        const pageFromParams = parseInt(searchParams.get("page") || "0", 10);
        if (!isNaN(pageFromParams)) {
            setCurrentPage(pageFromParams);
        }
    }, [searchParams]);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchHandle();
        handleFavorite();
    }, [filter, searchTerm, currentPage, fetchHandle]);

    const handleSearch = () => {
        setCurrentPage(0);
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setSearchTerm(searchValue);
        }, 100),
        []
    );

    const handleSearchInputChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const dateForm = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleEditProject = (projPkNum) => {
        navigate(`/main/proj/projedit/${projPkNum}`);
    };

    const handleDeleteProject = (projPkNum) => {
        setProjectToDelete(projPkNum);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            axios
                .delete(`/proj/projdelete/${projectToDelete}`)
                .then(() => {
                    setProjects(projects.filter((project) => project.proj_pk_num !== projectToDelete));
                    setIsModalOpen(false);
                })
                .catch((err) => {
                    console.error("Failed to delete project", err);
                    setIsModalOpen(false);
                });
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };

    // Handle favorite data
    const num = useSelector((state) => state.userData.user_pk_num);
    const [favorData, setFavorData] = useState([]);
    const handleFavorite = () => {
        axios
            .get(`/favorite/proj/${num}`)
            .then((res) => {
                setFavorData(res.data);
            })
            .catch();
    };

    const renderProjectRows = () => {
        if (loading)
            return (
                <tr>
                    <td colSpan="7" className="text-center">
                        로딩 중...
                    </td>
                </tr>
            );

        if (error)
            return (
                <tr>
                    <td colSpan="7" className="text-center text-danger">
                        {error}
                    </td>
                </tr>
            );

        if (projects.length === 0)
            return (
                <tr>
                    <td colSpan="7" className="text-center">
                        데이터가 없습니다.
                    </td>
                </tr>
            );

        return projects.slice(0, 8).map((project, index) => (
            <tr key={project.proj_pk_num || index}>
                <td className="text-center">
                    <FavorCheck
                        type="proj"
                        pknum={project.proj_pk_num}
                        favorData={favorData}
                    />
                </td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    <Link to={`/main/proj/projdetail/${project.proj_pk_num}`}>
                        {project.proj_name}
                    </Link>
                </td>
                <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {project.proj_desc}
                </td>
                <td>{project.proj_status}</td>
                <td>{dateForm(project.proj_enddate)}</td>
                <td>
                    <div className="d-flex align-items-center">
                        <span className="mr-2">{project.proj_progress}%</span>
                        <div className="progress-container">
                            <Progress
                                max="100"
                                value={project.proj_progress}
                                barClassName={`bg-${
                                    project.proj_progress === 100 ? "success" : "danger"
                                }`}
                            />
                        </div>
                    </div>
                </td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only" size="sm">
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem
                                onClick={() => handleEditProject(project.proj_pk_num)}
                            >
                                수정
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => handleDeleteProject(project.proj_pk_num)}
                            >
                                삭제
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
        ));
    };

    // Handle pagination and update query params
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        searchParams.set("page", newPage);
        searchParams.set("filter", filter);
        searchParams.set("searchTerm", searchTerm);
        setSearchParams(searchParams);
    };

    return (
        <>
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card className="shadow d-flex flex-column" style={{ marginTop: "95px" }}>
                            <CardHeader
                                className="d-flex align-items-center"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "15px",
                                    backgroundColor: "white",
                                    zIndex: 10,
                                }}
                            >
                                <h1>프로젝트 목록</h1>
                                <ProjSearch
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onSearch={fetchHandle}
                                />
                            </CardHeader>

                            <div className="table-responsive">
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>즐겨찾기</th>
                                        <th>프로젝트</th>
                                        <th>담당자</th>
                                        <th>상태</th>
                                        <th>기한</th>
                                        <th>진행도</th>
                                        <th>작업</th>
                                    </tr>
                                    </thead>
                                    <tbody>{renderProjectRows()}</tbody>
                                </Table>
                            </div>

                            <CardFooter>
                                <Pagination>
                                    <PaginationItem disabled={currentPage === 0}>
                                        <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                                            이전
                                        </PaginationLink>
                                    </PaginationItem>
                                    {[0, 1, 2].map((page) => (
                                        <PaginationItem active={currentPage === page} key={page}>
                                            <PaginationLink onClick={() => handlePageChange(page)}>
                                                {page + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                                            다음
                                        </PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={isModalOpen} toggle={cancelDelete}>
                <ModalHeader toggle={cancelDelete}>프로젝트 삭제</ModalHeader>
                <ModalBody>정말로 이 프로젝트를 삭제하시겠습니까?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={cancelDelete}>
                        취소
                    </Button>
                    <Button color="danger" onClick={confirmDelete}>
                        삭제
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ProjectTable;