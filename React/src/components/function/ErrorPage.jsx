import { Link, useLocation } from "react-router";

const ErrorPage = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const msg = queryParams.get('msg');

    return (
        <div>
            <p style={{fontSize:50}}>{msg}</p>
            <Link to="/main">홈으로 이동</Link>
        </div>
    );
}
export default ErrorPage;