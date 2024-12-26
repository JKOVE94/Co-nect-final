import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProjSearch = ({ value, onChange, onSearch, onKeyDown }) => {
  const compNo = useSelector((state) => state.userData.user_fk_comp_num);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    axios
      .get(`/proj/status/${compNo}`)
      .then((res) => setStatus(res.data))
      .catch((err) => navigator(`/error`));
  }, []);

  return (
    <div className="d-flex justify-content-end" style={{ padding: "0px" }}>
      <Col style={{ paddingLeft: "0px" }}>
        <Form.Select
          className="form-control"
          style={{ width: "100px" }}
          id="proj_status"
          onChange={onChange}
        >
          <option value="">상태</option>
          {status.map((data, index) => (
            <option value={data} key={index}>
              {data}
            </option>
          ))}
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
export default ProjSearch;
