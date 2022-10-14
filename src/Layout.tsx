import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Outlet} from 'react-router-dom';

const Layout = () : JSX.Element => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Layout
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <Outlet/>
            </main>
        </>
    );
};

export default Layout;
