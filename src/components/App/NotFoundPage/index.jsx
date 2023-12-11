import {Link} from 'react-router-dom'

function NotFoundPage() {
    return (
        <>
            <h1>Uh oh, that page doesn't exist.</h1>
            <Link to={`/`}>
                <span>Back to Home Page</span>
            </Link>
        </>
    );
}

export default NotFoundPage;