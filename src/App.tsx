import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';

const App = () : JSX.Element => {
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
