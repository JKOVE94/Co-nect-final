/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

//이 컴포넌트는 페이지의 상단에 위치하며, 페이지의 제목과 같은 정보를 표시합니다.
// 또한 div 속성으로 파란 배경이 깔리게 됩니다. 해당 div는 수정하지 맙시다.

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-6 pt-5 pt-md-8"></div>
    </>
  );
};

export default Header;
