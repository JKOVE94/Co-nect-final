import RecList from "./RecList";
import RecCreate from "./RecCreate";
import RecDetail from "./RecDetail";
import RecUpdate from "./RecUpdate";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

const RecHome = () => {
  return(
    <Container fluid style={{ marginTop: "1em", overflowY:"auto", height:"40rem" }}>
      <Routes>
        <Route path="/" element={<RecList />} />
        <Route path="/create" element={<RecCreate />} />
        <Route path="/detail/:recPkNum" element={<RecDetail />} />
        <Route path="/update/:recPkNum" element={<RecUpdate />} />
      </Routes>
    </Container>
  );
}
export default RecHome;