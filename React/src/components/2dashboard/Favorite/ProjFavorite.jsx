import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "../../../assets/css/2dashboard/favor.module.css";
import { useNavigate } from "react-router-dom";

const {
  Container,
  Card,
  CardBody,
  Table,
} = require("react-bootstrap");

const ProjFavorite = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const [favorProj, setFavorProj] = useState([{}]);
  const navigate = useNavigate();

  const getData = () => {
    axios
      .get("/favorite/proj/" + num)
      .then((res) => {
        setFavorProj(res.data);
      })
      .catch();
  };

  useEffect(() => {
    getData();
  }, [num]);

  const handleClick = (num) => {
    axios.delete("/favorite/"+num)
    .then((res)=>{
      if(res.data.isSuccess){
        getData();
      }
    })
    .catch();
  }

  const handlePage = (num) => {
    //proj read로 이동하는 코드 넣기
    navigate();
  }

  return (
    <Container fluid className={style.container}>
      <Card className="mx-auto">
        <CardBody className="p-10">
          <Card.Title><h3>즐겨찾기</h3></Card.Title>
          <Card.Subtitle className={style.subtitle}>프로젝트</Card.Subtitle>
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>분류</th>
                <th>작성자</th>
                <th>중요도</th>
                <th>시작날짜</th>
                <th>종료날짜</th>
                <th className={style.del}></th>
              </tr>
            </thead>
            <tbody>
              {favorProj.map((proj) => (
                <tr key={proj.favor_id}>
                  <td>{proj.proj_pk_num}</td>
                  <td>
                    <Card.Link onClick={() => handlePage(proj.proj_pk_num)}>{proj.proj_name}</Card.Link>
                  </td>
                  <td>{proj.proj_tag}</td>
                  <td>{proj.user_name}</td>
                  <td>{proj.proj_import}</td>
                  <td>{moment(proj.proj_startdate).format("YYYY-MM-DD")}</td>
                  <td>{moment(proj.proj_enddate).format("YYYY-MM-DD")}</td>
                  <td>
                    <Card.Link onClick={() => handleClick(proj.favor_id)}>&times;</Card.Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
};
export default ProjFavorite;
