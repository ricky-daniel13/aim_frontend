import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, useTheme, TableContainer, TableRow, TableHead, Table, TableCell, TableBody } from '@mui/material';
import {Invoice} from '../../api/Aim';

interface DialogProps {
    isOpen: boolean;
    invoice: Invoice|null;
    onClickClose: () => void;
}


const InvoicesProducts: React.FC<DialogProps> = ({ isOpen, invoice, onClickClose }) => {
    const theme = useTheme();

    //const [prodPurch, setProdPurch] = useState<ProductPurch[]>([]);

    return (
        <Dialog open={isOpen} fullWidth maxWidth='lg' PaperProps={{ sx: { borderRadius: 5 } }} keepMounted={false} onClose={onClickClose}>
            <DialogTitle>Products #{(invoice==null?0:invoice!.id)}</DialogTitle>
            <DialogContent sx={{ display: 'flex' }}>
                <TableContainer sx={{ height: '15rem'}}>
                    <Table stickyHeader sx={{ height: "max-content" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Product ID</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Product Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(invoice==null?[]:invoice!.products).map((row, index) => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}
                                >
                                    <TableCell component="th" scope="row" align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicesProducts;
