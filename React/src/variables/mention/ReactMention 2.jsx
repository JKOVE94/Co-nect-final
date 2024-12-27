import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { Mention } from "react-mentions";
import { MentionsInput } from "react-mentions";
import { Input } from "reactstrap";
import style from "../../assets/css/mention.module.css";

const ReactMention = ({ onMention, text, disabled, userList }) => {
  //onMention : 멘션 선택 시 동작, text : placeholder, disabled : boolean값
  //userList : 멘션 렌더링 시 default 값 (문자열)

  const [user, setUser] = useState([]); //전체 사원 목록
  const [data, setData] = useState(""); //멘션 input 입력값

  useEffect(() => {
    //최초 렌더링 시 전체 사원 목록 가져오기기
    getUserData();
  }, []);

  useEffect(() => {
    //userList값을 받은 경우, 멘션 input에 값 입력되어 렌더링
    //ex) userList : "1,3,5" -> 김일번, 김삼번, 김오번

    if (userList) {
      const list = userList.split(",");
      const selectedUsers = list.map((id) => {
        const userObj = user.find((user) => user.id === parseInt(id));
        return userObj ? `@[${userObj.display}](${id})` : "";
      });

      setData(selectedUsers.join(" "));
    }
  }, [userList, user]);

  const getUserData = () => {
    axios
      .get("/mention")
      .then((res) => {
        const userData = res.data.map((data) => ({
          id: data.user_pk_num,
          jik: data.user_rank,
          buser: data.dpartName,
          display: data.user_name,
        }));
        setUser(userData);
      })
      .catch((err) => console.error(err));
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
    return user.filter((user) => {
      return (
        user.display.includes(search) || user.id.toString().includes(search)
      );
    });
  };

  return (
    <div>
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
              <div>
                {suggestion.display}
                <small>({suggestion.id})</small>
              </div>
              <div>
                {suggestion.buser}/{suggestion.jik}
              </div>
            </div>
          )}
        />
      </MentionsInput>
    </div>
  );
};
export default ReactMention;
