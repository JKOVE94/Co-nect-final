import { Button, Card, Col, Form } from "react-bootstrap";

const Search = ({value, onChange, onSearch, onKeyDown}) => {
    
    return (
        <Card.Title className="d-flex justify-content-end">
            <Col md={2}>
                <Form.Control type="search" value={value} onChange={onChange} onKeyDown={onKeyDown}/>
            </Col>
            <Col md='auto'>
                <Button variant="outline-primary" onClick={onSearch}>검색</Button>
            </Col>
        </Card.Title>
    );
}
export default Search