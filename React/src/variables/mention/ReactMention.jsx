import React, { useEffect, useState } from "react";
import { Mention } from "react-mentions";
import { MentionsInput } from "react-mentions";
import style from "../../assets/css/mention.module.css";
import { useSelector } from "react-redux";
import axiosInstance from "api/axiosInstance";

const ReactMention = ({ onMention, text, disabled, userList }) => {
  //onMention : 멘션 선택 시 동작, text : placeholder, disabled : boolean값
  //userList : 멘션 렌더링 시 default 값 (문자열)

  const compNum = useSelector((state) => state.userData.user_fk_comp_num); // 회사번호
  const [users, setUsers] = useState([]); //전체 사원 목록
  const [data, setData] = useState(""); //멘션 input 입력값
  const [error, setError] = useState();

  useEffect(() => {
    //최초 렌더링 시 전체 사원 목록 가져오기기
    getUserData();
  }, []);

  useEffect(() => {
    //userList값을 받은 경우, 멘션 input에 값 입력되어 렌더링
    if (userList) {
      const selectedUsers = userList.map((id) => {
        const userObj = users.find((user) => user.id === parseInt(id));
        return userObj ? `@[${userObj.display}](${id})` : "";
      });

      setData(selectedUsers.join(" "));
    }
  }, [userList, users]);

  const getUserData = () => {
    axiosInstance
      .get(`/conect/mention/${compNum}`)
      .then((res) => {
        const userData = res.data.map((data) => ({
          id: data.user_pk_num,
          email: data.user_mail,
          display: data.user_name,
        }));
        setUsers(userData);
      })
      .catch((err) => setError(err));
  };

  const handleChange = (e, newValue, newPlainTextValue, mentions) => {
    //onMention에 멘션된 유저의 pk num 전달
    setData(e.target.value);

    let data = [];
    mentions.forEach((mention) => {
      data.push(mention.id);
    });
    onMention(data);
  };

  const findById = (search) => {
    //pk num으로 검색 가능
    return users.filter((user) => {
      return (
        user.display.includes(search) || user.id.toString().includes(search)
      );
    });
  };

  return (
    <div>
      {users && (
        <MentionsInput
          value={data}
          onChange={handleChange}
          placeholder={text}
          disabled={disabled}
          className="mentions"
          classNames={style}
        >
          <Mention
            className={style.mentions__mention}
            appendSpaceOnAdd={true}
            trigger="@" //input 박스에 @ 입력 시 멘션 기능 활성화
            data={(search) => findById(search)}
            renderSuggestion={(
              suggestion,
              search,
              highlightedDisplay,
              index,
              focused
            ) => (
              <div
                style={{
                  backgroundColor: focused ? "lightblue" : "white",
                  padding: "10px",
                }}
              >
                <div>{suggestion.display}</div>
                <div>
                  <small>{suggestion.email}</small>
                </div>
              </div>
            )}
          />
        </MentionsInput>
      )}
      {error && <span style={{ color: "red" }}>{error.response.data}</span>}
    </div>
  );
};
export default ReactMention;
