import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Outlet} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Layout = () : JSX.Element => {
    const { logout } = useAuth0();
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                    <Button 
                        color="secondary"
                        onClick={() => {
                            logout();
                        }}
                        >Log Out</Button>
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
