import * as React from 'react';
import { Drawer, Box, useTheme, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';

interface DrawerProps {
    open: boolean;
    drawerWidth: number;
    onClose: () => void;
    onLogout: () => void;
}

const AimDrawer: React.FC<DrawerProps> = ({ open, drawerWidth, onClose, onLogout }) => {
    const theme = useTheme();

    const drawerComponents = (
        <div>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'center',
            }}>
                <Typography variant="h6" noWrap component="div">
                    AIM Edge Apps
                </Typography>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Invoices"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <List style={{ position: "absolute", bottom: 0, right: 0, left: 0, }}>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={onLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );


    return (
        <div>
            <Drawer
                variant="temporary"
                anchor="left"
                onClose={onClose}
                sx={{
                    display: { xs:'block', sm: 'block', md: 'none' }, flexShrink: 0, width: drawerWidth,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open={open}>
                    {drawerComponents}
            </Drawer>
            <Drawer
                variant="persistent"
                anchor="left"
                sx={{
                    display: { xs:'none',  sm: 'none', md: 'block' }, flexShrink: 0, width: drawerWidth,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open={true}>
                    {drawerComponents}
            </Drawer>
        </div>
    );
};

export default AimDrawer;
