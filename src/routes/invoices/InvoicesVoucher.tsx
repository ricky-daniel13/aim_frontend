import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, useTheme, Box } from '@mui/material';
import { Invoice } from '../../api/Aim';

interface DialogProps {
    isOpen: boolean;
    invoice: Invoice | null;
    onClickClose: () => void;
}


const InvoicesVoucher: React.FC<DialogProps> = ({ isOpen, invoice, onClickClose }) => {
    const theme = useTheme();
    
    return (
        <Dialog open={isOpen} fullWidth maxWidth='md' PaperProps={{ sx: { borderRadius: 5 } }} keepMounted={false} onClose={onClickClose}>
            <DialogTitle>Products #{(invoice == null ? 0 : invoice!.id)}</DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent:'center' }}>
                <Box sx={{ padding: theme.spacing(2), width: "80%", aspectRatio: 1 / 1 }}>
                    <img src={invoice ? invoice.imageUrl : ""} style={{ width: '100%', objectFit: 'scale-down' }} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicesVoucher;
