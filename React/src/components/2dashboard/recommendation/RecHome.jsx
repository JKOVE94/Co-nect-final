import RecList from "./RecList";
import RecCreate from "./RecCreate";
import RecDetail from "./RecDetail";
import RecUpdate from "./RecUpdate";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Error from "./Error";
import { useState } from "react";

const RecHome = () => {
  const projPkNum = sessionStorage.getItem("persist:proj_pk_num");
  
  //에러
  const [error, setError] = useState();
  const [errorIsOpen, setErrorIsOpen] = useState(false);

  const handleError = (error, errorIsOpen) => {
    setError(error);
    setErrorIsOpen(errorIsOpen);
  };


  return (
    <Container
      fluid
      style={{ marginTop: "1em", overflowY: "auto", height: "80vh" }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <RecList handleError={handleError} projPkNum={projPkNum} />
          }
        />
        <Route
          path="/create"
          element={
            <RecCreate handleError={handleError} projPkNum={projPkNum} />
          }
        />
        <Route
          path="/detail/:recPkNum"
          element={
            <RecDetail handleError={handleError} projPkNum={projPkNum} />
          }
        />
        <Route
          path="/update/:recPkNum"
          element={<RecUpdate handleError={handleError} />}
        />
      </Routes>
      <Error
        error={error}
        isOpen={errorIsOpen}
        onClose={() => {
          setErrorIsOpen(false);
        }}
      />
    </Container>
  );
};
export default RecHome;