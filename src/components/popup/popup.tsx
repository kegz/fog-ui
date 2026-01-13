import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PopupProps {
    title: string;
    open: boolean;
    onClose: () => void;
    component: React.ReactNode;
    buttons?: { text: string; onClick: () => void }[];
}

export const Popup: React.FC<PopupProps> = ({ title, open, onClose, component, buttons }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
            data-testid="popup-dialog"
            aria-labelledby="popup-dialog-title"
            aria-describedby="popup-dialog-content"
        >
            <DialogTitle
                sx={{ m: 0, p: 2 }}
                id="popup-dialog-title"
                data-testid="popup-dialog-title"
            >
                {title}
                <IconButton
                    aria-label="Close dialog"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    data-testid="popup-close-button"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                id="popup-dialog-content"
                data-testid="popup-dialog-content"
            >
                <Box>{component}</Box>
            </DialogContent>

            <DialogActions data-testid="popup-dialog-actions">
                {buttons?.map((button, index) => (
                    <Button
                        key={index}
                        onClick={button.onClick}
                        variant="contained"
                        data-testid={`popup-action-button-${index}`}
                        aria-label={button.text}
                    >
                        {button.text}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
};

