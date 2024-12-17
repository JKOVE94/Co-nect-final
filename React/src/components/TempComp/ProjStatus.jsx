import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import ProjHeader from "../2dashboard/Headers/ProjHeaders";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardHeader,
  Table,
  CardTitle,
} from "reactstrap";

const ProjStatus = () => {
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchProjectData = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/proj/projread/${id}`)
      .then((res) => {
        setProj(res.data);
      })
      .catch((error) => {
        setError("프로젝트 데이터를 불러오는데 실패했습니다.");
        console.error("프로젝트 데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!proj) return <p>프로젝트 정보가 없습니다.</p>;

  return (
    <>
      <ProjHeader></ProjHeader>
      <Container fluid className="mt--7"></Container>
    </>
  );
};

export default ProjStatus;
