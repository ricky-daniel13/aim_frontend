import * as React from 'react';
import {Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

interface DrawerProps {
    drawerWidth: number;
    onOpenDrawer?: () => void;
}

const AimDrawer: React.FC<DrawerProps> = ({drawerWidth, onOpenDrawer }) => {
    const UserState = useContext(AuthContext);
    return (
        <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }, }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onOpenDrawer}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Invoices
                    </Typography>
                    <Typography variant="button">
                    {UserState?.userData.name}
                    </Typography>
                </Toolbar>
            </AppBar>
    );
};

export default AimDrawer;
