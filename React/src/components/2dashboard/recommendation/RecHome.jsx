import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostSearch from "variables/Search/PostSearch";

const RecHome = () => {

    const [datas, setDatas] = useState([{}]);
    const [allArr, setAllArr] = useState([]);
    const [voteArr, setVoteArr] = useState([]);

    const num = useSelector((state) => state.userData.user_pk_num);
    const comp = useSelector((state) => state.userData.user_fk_comp_num);
    const { projPkNum } = useParams(); ///:projPkNum으로 넘어온 값 가져오기

    const getData = () => {
        axios.get(`/${comp}/rec/${projPkNum}`)
            .then((res) => {
                setDatas(res.data);
            })
            .catch();
    }

    useEffect(()=>{
        getData();
    },[])

    const handleProgress = (all, voter) => {
        // setAllArr([...all.split(",")]);
        // setVoteArr([...voter.split(",")]);
        // return (voteArr.length/allArr.length); 
    }

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Row className="mx-0 align-items-start justify-content-center">
        <Col>
          <Card>
            <CardHeader
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2>건의사항</h2>
              <div style={{ display: "flex" }}>
                {/*수정할거 */}
                <PostSearch
                  value={""}
                  onChange={""}
                  onSearch={""}
                  onKeyDown={""}
                />
              </div>
            </CardHeader>
            <CardBody>
              <AppBar position="static" style={{ backgroundColor: "#333333" }}>
                <Toolbar variant="dense">
                  <Typography
                    variant="body2"
                    color="inherit"
                    component="div"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Col xs={3}>제목</Col>
                    <Col xs={1}>작성자</Col>
                    <Col xs={3}>기간</Col>
                    <Col xs={2}>투표율</Col>
                    <Col xs={2}>투표현황</Col>
                  </Typography>
                </Toolbar>
              </AppBar>
              {datas.map((data) => (
                    <Accordion slotProps={{ heading: { component: "h4" } }}>
                    <AccordionSummary
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                        <Col xs={3}>{data.rec_title}</Col>
                        <Col xs={1}>{data.user_name}</Col>
                        <Col xs={3}>
                        <small>
                        {moment(data.vote_start).format("YYYY-MM-DD")} ~ {moment(data.vote_end).format("YYYY-MM-DD")}
                        </small>
                        </Col>
                        <Col xs={2}>
                            <ProgressBar now={handleProgress(data.proj_members, data.vote_voter)} />
                        </Col>
                        <Col xs={2}>투표현황</Col>     
                        <Col>투표버튼</Col>    
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>{data.rec_content}</div>
                    </AccordionDetails>
                </Accordion>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default RecHome;
