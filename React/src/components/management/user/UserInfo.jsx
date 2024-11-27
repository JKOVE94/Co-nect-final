import React,{useState, useEffect} from 'react';
import axios from 'axios';

const UserInfo = () => {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
        axios.get('/manage/user')
        .then(data => {
            setUsers(data.data);})
},[])

    return(
        <div>
            <h1>회원 리스트</h1>
    <table>
     	<tr>
        	<th>사번</th>
            <th>이름</th>
            <th>직급</th>
            <th></th>
            <th></th>
        </tr>
        {users.map(user =>
        <tr>
            <td>{user.user_pk_num}</td>
            <td>{user.user_name}</td>
            <td>{user.user_rank}</td>
            <td><div className='click'>수정</div></td>
            <td><div>삭제</div></td>
        </tr>
        )};
    </table>
<a href="${pageContext.request.contextPath}/manage?fn=ADMIN_MANAGE" class="btn btn-primary">관리자 페이지로 돌아가기</a>
        </div>
    )
}

export default UserInfo;