import React from 'react';
import { CircularProgress, Box, Typography, Divider } from '@mui/material';

interface ProgressItem {
    id: number;
    value: number;
    title: string;
}

interface CircularProgressListProps {
    items: ProgressItem[];
}

export const CircularProgressList: React.FC<CircularProgressListProps> = ({ items }) => {
    return (
        <Box
            data-testid="circular-progress-list"
            role="list"
            aria-label="Progress list"
        >
            {items.map((item, index) => (
                <Box
                    key={item.id}
                    sx={{ marginBottom: 2 }}
                    data-testid={`progress-item-${item.id}`}
                    role="listitem"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{ position: 'relative', display: 'inline-flex' }}
                            data-testid={`progress-circle-${item.id}`}
                        >
                            <CircularProgress
                                variant="determinate"
                                value={item.value}
                                size={80}
                                thickness={5}
                                aria-label={`${item.title} progress`}
                                role="progressbar"
                                aria-valuenow={item.value}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                            <Box
                                sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
                                aria-hidden="true"
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    color="text.secondary"
                                    data-testid={`progress-value-${item.id}`}
                                >
                                    {`${Math.round(item.value)}%`}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            sx={{ marginLeft: 2 }}
                            data-testid={`progress-title-${item.id}`}
                        >
                            {item.title}
                        </Typography>
                    </Box>
                    {index < items.length - 1 && <Divider sx={{ marginY: 2 }} />}
                </Box>
            ))}
        </Box>
    );
};

