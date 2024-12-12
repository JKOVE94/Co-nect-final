import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { Mention } from "react-mentions";
import { MentionsInput } from "react-mentions";
import { Input } from "reactstrap";

const ReactMention = ({ onMention, text, disabled, selectId, userList }) => {
  const [user, setUser] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (selectId) {
      const userObj = user.find(user => user.id === parseInt(selectId));
      if (userObj) {
        setData(`@[${userObj.display}](${selectId})`);
      }
    }
  }, [selectId, user]);

  useEffect(()=>{
    if(userList){
        const list = userList.split(",");
        const selectedUsers = list.map((id) => {
            const userObj = user.find((user) => user.id === parseInt(id));
            return userObj ? `@[${userObj.display}](${id})` : "";
          });
      
          setData(selectedUsers.join(" "));
        }
  }, [userList, user])

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
      .catch((err) => console.log(err));
  };

  const handleChange = (e, newValue, newPlainTextValue, mentions) => {
    setData(e.target.value);
    
    let data = [];
    mentions.forEach((mention) => {
        data.push(mention.id);
    })
    onMention(data);
  }

  const findById = (search) => {
    return user.filter((user) => {
      return user.display.includes(search) || user.id.toString().includes(search);
    });
  };    

  return (
    <>
      <MentionsInput
        value={data}
        onChange={handleChange}
        placeholder={text}
        disabled={disabled}
        > 
        <Mention
          appendSpaceOnAdd={true}
          trigger="@"
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
    </>
  );
};
export default ReactMention;
