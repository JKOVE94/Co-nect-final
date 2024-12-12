import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Mention } from 'react-mentions';
import { MentionsInput } from 'react-mentions';

const ReactMention = ({value, onChange, text, disabled}) => {
    const [user, setUser] = useState([]);
    
    useEffect(() => {
        getUserData();
    },[]);

    const getUserData = () => {
        axios.get('/mention')
            .then(res => {
                const userData = res.data.map(data => ({
                    id: data.user_pk_num,
                    jik : data.user_rank,
                    buser : data.dpartName,
                    display:data.user_name
                }));
                setUser(userData);
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <MentionsInput className='form-control' value={value} onChange={onChange} placeholder={text} disabled={disabled}>
                <Mention
                    trigger="@"
                    data={user}
                    displayTransform={(id, display) => `@${display}`}
                    renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                        <div style={{ backgroundColor: focused ? 'lightblue' : 'white', padding:'10px'}}>
                            <div>{suggestion.display}<small>({suggestion.id})</small></div>
                            <div>
                                {suggestion.buser}/{suggestion.jik}
                            </div> 
                        </div>
                    )}
                />
            </MentionsInput>
        </>
        
    );
}
export default ReactMention;