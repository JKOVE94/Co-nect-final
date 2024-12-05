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
  Table
} = require("react-bootstrap");

const FreeFavorite = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const [favorFree, setFavorFree] = useState([{}]);
  const navigate = useNavigate();
  const getData = () => {
    console.log('?');
    axios
      .get("/favorite/post/" + num)
      .then((res) => {
        setFavorFree(res.data);
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
          <Card.Subtitle className={style.subtitle}>자유게시글</Card.Subtitle>
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>분류</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
                <th className={style.del}></th>
              </tr>
            </thead>
            <tbody>
              {favorFree.map((free) => (
                <tr key={free.favor_id}>
                  <td>{free.post_pk_num}</td>
                  <td>
                    <Card.Link className={style.link} onClick={() => handlePage(free.post_pk_num)}>{free.post_name}</Card.Link>
                  </td>
                  <td>{free.post_tag}</td>
                  <td>{free.user_name}</td>
                  <td>{moment(free.post_regdate).format("YYYY-MM-DD")}</td>
                  <td>{free.post_view}</td>
                  <td>
                    <Card.Link className={style.link} onClick={() => handleClick(free.favor_id)}>&times;</Card.Link>
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
export default FreeFavorite;
