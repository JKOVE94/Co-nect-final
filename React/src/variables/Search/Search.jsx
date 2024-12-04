import { useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";

const Search = ({type, value, onChange, onSearch, onKeyDown}) => {

    const [title] = useState(type ==='post'? 'post_name' : 'proj_name');

    return (
        <Card.Title className="d-flex justify-content-end">
            <Col md={2}>
                <Form.Select className="form-control" id="type" onChange={onChange}>
                    <option hidden>분류</option>
                    <option value={title}>제목</option>
                    <option value='user_name'>작성자</option>
                </Form.Select>
            </Col>
            <Col md={3}>
                <Form.Control type="search" id="search" value={value} onChange={onChange} onKeyDown={onKeyDown}/>
            </Col>
            <Col md='auto'>
                <Button variant="outline-primary" onClick={onSearch}>검색</Button>
            </Col>
        </Card.Title>
    );
}
export default Search