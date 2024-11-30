const UserAdd = () => {
    return (
        <div>
            <form>
                <input type="hidden" name="user_fk_comp_num" value="1" />
                
                <label htmlFor="user_pic">사진</label>
                <input className="form-control" type="file" id="user_pic" name="user_pic" /><br/>

                <label htmlFor="user_pk_num">사번</label>
                <input className="form-control" type="number" id="user_pk_num" name="user_pk_num" required /><br/>

                <label htmlFor="user_name">이름</label>
                <input className="form-control" type="text" id="user_name" name="user_name" required /><br/>

                <label htmlFor="user_pw">임시비밀번호</label>
                <input className="form-control" type="password" id="user_pw" name="user_pw" required /><br/>

                <label htmlFor="user_mail">이메일</label>
                <input className="form-control" type="email" id="user_mail" name="user_mail" required /><br/>

                <label htmlFor="user_regdate">입사일</label>
                <input className="form-control" type="date" id="user_regdate" name="user_regdate" required /><br/>

                <label htmlFor="user_rank">직급</label>
                <select className="form-control" name="user_rank" id="user_rank">
                    <option value="사원">사원</option>
                    <option value="대리">대리</option>
                    <option value="과장">과장</option>
                    <option value="차장">차장</option>
                    <option value="부장">부장</option>
                    <option value="이사">이사</option>
                    <option value="전무">전무</option>
                    <option value="사장">사장</option>
                </select><br/>

                <label htmlFor="user_fk_job_num">직무</label>
                <select className="form-control" name="user_fk_job_num" id="user_fk_job_num">
                    <option value="1">개발</option>
                    <option value="2">기획</option>
                    <option value="3">디자인</option>
                    <option value="4">마케팅</option>
                    <option value="5">영업</option>
                    <option value="6">경영</option>
                    <option value="7">인사</option>
                    <option value="8">경영지원</option>
                    <option value="9">인사</option>
                </select><br/>

                <label htmlFor="user_fk_dpart_num">소속 부서</label>
                <select className="form-control" id="user_fk_dpart_num" name="user_fk_dpart_num">
                    <option value="1">영업부</option>
                    <option value="2">기술부</option>
                    <option value="3">생산부</option>
                    <option value="4">경영지원부</option>
                    <option value="5">인사부</option>
                </select><br/>

                <label htmlFor="user_fk_acc_authornum">계정 권한</label>
                <select className="form-control" id="user_fk_acc_authornum" name="user_fk_acc_authornum">
                    <option value="1">유저</option>
                    <option value="2">프로젝트 관리자</option>
                    <option value="3">총 관리자</option>
                    <option value="4">사용제한</option>
                </select><br/>
            </form>
        </div>
    );
}

export default UserAdd;