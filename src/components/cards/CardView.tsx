// src/components/CardView.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface CardViewProps {
    title?: string | null;
    description: string;
    component?: React.ReactNode;
    onViewClick: () => void;
}

export const CardView: React.FC<CardViewProps> = ({ title, description, onViewClick, component }) => {
    return (
        <Card
            sx={{ maxWidth: 345, borderRadius: '12px', boxShadow: 3 }}
            data-testid="card-view"
            role="article"
            aria-label={title || "Card"}
        >
            {title ?
                <CardContent data-testid="card-view-title-container">
                    <Typography
                        variant="h5"
                        component="div"
                        fontWeight="bold"
                        data-testid="card-view-title"
                    >
                        {title}
                    </Typography>
                </CardContent>
                : null}

            {description ?
                <CardContent data-testid="card-view-description-container">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="card-view-description"
                    >
                        {description}
                    </Typography>
                </CardContent>
                : null}

            {component ?
                <CardContent data-testid="card-view-component-container">
                    {component}
                </CardContent>
                : null}

            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }} data-testid="card-view-actions">
                <Button
                    variant="contained"
                    onClick={onViewClick}
                    sx={{ width: '100%' }}
                    data-testid="card-view-button"
                    aria-label={`View ${title || 'details'}`}
                >
                    View
                </Button>
            </Box>
        </Card>
    );
};
