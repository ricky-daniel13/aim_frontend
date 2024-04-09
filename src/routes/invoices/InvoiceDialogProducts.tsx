import * as React from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductPurch } from '../../api/Aim';

interface InvoiceTableProps {
    rows: ProductPurch[];
    onClickDelete: (i:number) => void
    onAmountUpdate: (i:number, value:string) => void
}

const InvoiceDialogProducts: React.FC<InvoiceTableProps> = ({ rows, onClickDelete, onAmountUpdate }) => {
    return (
        <TableContainer sx={{height: '15rem', width: '40rem'}}>
            <Table stickyHeader sx={{ height: "max-content" }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Product ID</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Product Name</TableCell>
                        <TableCell align="center">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}
                        >
                            <TableCell component="th" scope="row"  align="center">{row.id}</TableCell>
                            <TableCell align="center"><TextField
                                    id="quantity-field"
                                    type="number"
                                    fullWidth={false}
                                    sx={{width:'5em'}}
                                    value={row.quantity.toString()}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {onAmountUpdate(index, event.target.value)}}/></TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">
                                    <IconButton onClick={()=>{onClickDelete(index)}}>
                                        <DeleteIcon />
                                    </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InvoiceDialogProducts;
