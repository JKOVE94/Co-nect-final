import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Mention } from 'react-mentions';
import { MentionsInput } from 'react-mentions';

const ReactMention = ({value, onChange, text}) => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        getUserData();
    },[]);

    const getUserData = () => {
        axios.get('/mention')
            .then(res => {
                const userData = res.data.map(data => ({
                    id: data.user_pk_num,
                    display: data.user_name,
                }));
                setUser(userData);
            })
            .catch(err => console.log(err));
    }

    return (
        <MentionsInput value={value} onChange={onChange} placeholder={text}>
            <Mention
                trigger="@"
                data={user}
                markup='display'
            />
        </MentionsInput>
    );
}
export default ReactMention;