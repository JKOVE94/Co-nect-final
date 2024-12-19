import { Route, Routes } from "react-router-dom";
import RecList from "./RecList";
import RecCreate from "./RecCreate";
import RecDetail from "./RecDetail";
import RecUpdate from "./RecUpdate";
import { Container } from "react-bootstrap";
import RecModal from "variables/Modal/RecModal";

const RecHome = () => {
  return(
    <Container fluid style={{ height: "40em", marginTop: "1em", overflowY:"auto" }}>
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