import React from 'react';
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material';
import { TopBarProps } from './types';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC<TopBarProps> = ({ pageTitle }) => {
    const navigate = useNavigate();

    const handleAdminClick = () => {
        navigate('/configuration');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.getItem('pageTitle');
        navigate('/');
    };

    return (
        <AppBar
            position="absolute"
            style={{ width: "calc(100vw - 300px)", left: "300px" }}
            data-testid="topbar"
            role="banner"
        >
            <Toolbar
                sx={{ justifyContent: 'space-between' }}
                data-testid="topbar-toolbar"
            >
                <Typography
                    variant="h6"
                    component="div"
                    data-testid="topbar-title"
                    aria-label={`Current page: ${pageTitle}`}
                >
                    {pageTitle}
                </Typography>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    data-testid="topbar-actions"
                    role="toolbar"
                    aria-label="User actions"
                >
                    <Button
                        variant="contained"
                        onClick={handleAdminClick}
                        data-testid="topbar-admin-button"
                        aria-label="Go to admin configuration"
                    >
                        Admin
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        data-testid="topbar-logout-button"
                        aria-label="Log out of application"
                    >
                        Log Out
                    </Button>
                    <Avatar
                        data-testid="topbar-avatar"
                        aria-label="User avatar"
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

