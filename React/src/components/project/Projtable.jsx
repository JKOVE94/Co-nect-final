import axios from "axios";
import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    Input,
    Button,
    FormGroup,
    Label,
    Col,
    Card,
    CardBody,
    CardTitle,
    Table,
    Row,
  } from "reactstrap";


export default function Projtable(){
    const [projs, setProjs] = useState([]);
    //나중에 reducer 공유자원에서 가져올 compNum
    //const compNum = useSelector((state) => state.user.user_fk_comp_num);
    const compNum = 1; //테스트용 임시 값 지워주기

    const showList = () => {
        axios.get(`/board/${compNum}`)
        .then((res)=>{
            console.log(res.data);
            //최신 날짜 기준으로 프로젝트 5개만 자르기
            const sortData = res.data
            .sort((a,b)=> new Date(b.proj_startdate) - new Date(a.proj_startdate))
            .slice(0, 5);
            setProjs(sortData);

        })
        .catch(error => {
            console.log("showList 오류:" + error);
        })
    }
    
    useEffect(()=>{
        showList();
    },[]);

    const navigate = useNavigate();

    const gotoProjLists = (compNum) => {
        navigate(`/board/projread/${compNum}`);
    };

    //기한 날짜 yyyy-mm-dd 양식 설정
    const dateForm = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2,'0');
        const day = date.getDate().toString().padStart(2,'0');

        let yyyy_mm_dd = `${year}.${month}.${day}`;
        return yyyy_mm_dd;
      };

    return(
        <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
        <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-center mb-4">프로젝트 목록</h2>
            <Button onClick={()=>{gotoProjLists(compNum)}}>더보기</Button>
        </div>
          <Row>
            <Col sm={12}>                      
              <Table striped>
                <thead>
                  <tr>
                    <th>프로젝트</th>
                    <th>담당자</th>
                    <th>상태</th>
                    <th>기한</th>
                    <th>진행도</th>
                  </tr>
                </thead>
                <tbody>
                  {projs.length === 0 ? (
                    <tr>
                      <td colSpan="6">프로젝트 데이터가 없습니다.</td>
                    </tr>
                  ) : (
                    projs.map((proj) => (
                      <tr key={proj.proj_pk_num}>
                        <td>{proj.proj_name}</td>
                        <td>{proj.proj_username}<br/>
                            {proj.proj_userMail}
                        </td>
                        <td>{proj.proj_status}</td>
                        <td>{dateForm(proj.proj_enddate)}</td>
                        <td>{proj.proj_progress}</td>
                        <td><div class="dropdown"></div></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
  
    )









}