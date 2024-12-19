import axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, CardTitle, Col, Dropdown, DropdownButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import RecReplylike from "./RecReplylike";
import RecReplyCreate from "./RecReplyCreate";
import moment from "moment";
import '../../../../assets/css/2dashboard/rec.css'
import RecReply from "./RecReply";
const RecReplyList = ({recPkNum}) => {
    const compNum = JSON.parse(
        //회사번호
        sessionStorage.getItem("persist:userInfo")
      ).user_fk_comp_num;
    const [datas, setDatas] = useState([]);

    const getData = async () => {
        try {
          const res = await axios.get(`/${compNum}/rec/reply/${recPkNum}`);
          setDatas(res.data.map(data => ({ ...data, disable: true })));
        } catch (err) {
          console.log("Error fetching data:", err);
        }
      };

    useEffect(()=>{
        getData();
    },[recPkNum])
    
    return(
        <Card>
            <CardTitle>
                댓글
            </CardTitle>
            <CardBody>
            {datas ? datas.map((data,index) => (
                <RecReply key={index} data={data} recPkNum={recPkNum} getData={getData}/>
            )) : <></>}
            </CardBody>
            <RecReplyCreate recPkNum={recPkNum} getData={getData} />
        </Card>
    );
}
export default RecReplyList;