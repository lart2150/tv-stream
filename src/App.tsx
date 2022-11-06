import {useAuth0} from '@auth0/auth0-react';
import {lazy, Suspense, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';

const Home = lazy(async () => import('@/pages/Home'));

const App = () : JSX.Element => {
    const {loginWithRedirect, isAuthenticated, isLoading} = useAuth0();
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect();
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return <span>Loading....</span>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Suspense fallback={<div>loading...</div>}><Home/></Suspense>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
