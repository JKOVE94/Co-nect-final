import { useState } from "react";
import { Button, Card, Col, Container, Form } from "react-bootstrap";

const PostSearch = ({ value, onChange, onSearch, onKeyDown }) => {
  return (
    <div className="d-flex justify-content-end" style={{ padding: "0px" }}>
      <Col style={{ paddingLeft: "0px" }}>
        <Form.Select
          className="form-control"
          style={{ width: "100px" }}
          id="type"
          onChange={onChange}
        >
          <option hidden>분류</option>
          <option value="post_name">제목</option>
          <option value="user_name">작성자</option>
        </Form.Select>
      </Col>
      <Col style={{ paddingLeft: "0px" }}>
        <Form.Control
          style={{ width: "200px" }}
          type="search"
          id="search"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </Col>
      <Col style={{ paddingLeft: "0px" }}>
        <Button
          variant="outline-primary"
          style={{ marginTop: "0px" }}
          onClick={onSearch}
        >
          검색
        </Button>
      </Col>
    </div>
  );
};
export default PostSearch;
