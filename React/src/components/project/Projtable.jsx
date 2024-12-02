import axios from "axios";
import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


export default function Projtable(){
    const [projs, setProjs] = useState([]);
    //나중에 reducer 공유자원에서 가져올 compNum
    //const compNum = useSelector((state) => state.user.user_fk_comp_num);
    const compNum = 1; //테스트용 임시 값 지워주기

    const showList = () => {
        axios.get(`/board/${compNum}`)
        .then((res)=>{
            console.log(res.data);
            setProjs(res.data);
        })
        .catch(error => {
            console.log("showList 오류:" + error);
        })
    }
    
    useEffect(()=>{
        showList();
    },[]);

    const navigate = useNavigate();

    return(
        <>
            <h5>프로젝트 테이블</h5><button>더 보기</button>
            <table>
                <thead>
                    <th>프로젝트</th><th>담당자</th><th>상태</th><th>기한</th><th>진행도</th>
                </thead>
                <tbody>
                    {projs.map(proj=>(
                        <tr key={proj.proj_pk_num}>
                            <td>{proj.proj_name}</td>
                            <td>{proj.proj_username}</td>
                            <td>{proj.proj_status}</td>
                            <td>{proj.proj_enddate}</td>
                            <td>{proj.proj_progress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </>
    )









}