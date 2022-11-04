import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';

const App = () : JSX.Element => {
    const { loginWithRedirect, isAuthenticated, isLoading} = useAuth0();
    React.useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return <span>Loading....</span>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
