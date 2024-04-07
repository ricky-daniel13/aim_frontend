import * as React from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, useMediaQuery, useTheme } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import { Invoice, ProductPurch } from '../../api/Aim';
import moment from 'moment';


interface InvoiceTableProps {
    rows: Invoice[];
    totalRowCount: number,
    onPageChange: (page: number) => void;
    onVoucherClick: (invoiceNumber: number) => void;
    onProductsClick: (invoiceNumber: number) => void;
}

function CalculateSubtotal(products: ProductPurch[]): number{
    return products.reduce(
        (sum: number, product) => sum + (product.unitPrice * product.quantity), 0
      );
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ rows, onPageChange, onVoucherClick, onProductsClick, totalRowCount }) => {
    const [page, setPage] = React.useState(0);
    const theme = useTheme();
    const isBig = useMediaQuery(theme.breakpoints.up('md'));

    const rowsPerPage = 5;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        onPageChange(newPage);
    };

    const handleVoucherClick = (invoiceNumber: number) => {
        onVoucherClick(invoiceNumber);
    };

    const handleProductsClick = (invoiceNumber: number) => {
        onProductsClick(invoiceNumber);
    };

    return (
            <TableContainer>
                <Table size={isBig ? "medium" : "small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"> # Invoice</TableCell>
                            <TableCell align="center">Client</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center" sx={{display: { sm: 'none', xs:'none', md:'table-cell'} }}>Subtotal</TableCell>
                            <TableCell align="center" sx={{display: { sm: 'none', xs:'none', md:'table-cell'} }}>Discount</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Voucher</TableCell>
                            <TableCell align="center">Products</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            const subtotal = CalculateSubtotal(row.products);
                            const total = subtotal - (subtotal / 100) * row.discount;
                            return (
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}>
                                <TableCell component="th" align="left">{row.id}</TableCell>
                                <TableCell align="center">{row.clientName}</TableCell>
                                <TableCell align="center">{moment(row.date).format("DD/MM/YYYY")}</TableCell>
                                <TableCell align="right" sx={{display: { sm: 'none', xs:'none', md:'table-cell'} }}>${subtotal}</TableCell>
                                <TableCell align="center" sx={{display: { sm: 'none', xs:'none', md:'table-cell'} }}>{row.discount}%</TableCell>
                                <TableCell align="right">${total}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleVoucherClick(index)}>
                                        <ReceiptIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleProductsClick(index)}>
                                        <CategoryIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );})}
                    </TableBody>
                </Table>
                <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={totalRowCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
            </TableContainer>
    );
};

export default InvoiceTable;
