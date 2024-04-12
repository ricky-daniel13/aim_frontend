import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Divider, Button, useTheme, MenuItem, TextField, Snackbar, useMediaQuery, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import InvoiceDialogProducts from './InvoiceDialogProducts';
import { Client, NewInvoice, NewProdPurch, Product, ProductPurch } from '../../api/Aim';
import moment from 'moment';

interface DialogProps {
    isOpen: boolean;
    products: Product[];
    clients: Client[];
    onClickClose: () => void
    onCreateInvoice: (inv: NewInvoice) => void
}


const InvoiceDialog: React.FC<DialogProps> = ({ isOpen, products, clients, onClickClose, onCreateInvoice }) => {
    const theme = useTheme();
    const isBig = useMediaQuery(theme.breakpoints.up('sm'));
    const imagePreview = '/photo_upload.png';
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("onImageChange event: ", event);
        if (event.target.files && event.target.files[0]) {
            const validImageTypes = ["image/jpeg", "image/png"];

            const thisFile = event.target.files[0];

            let fileAccepted = validImageTypes.reduce((accepted: boolean, filetype: string) => accepted || (thisFile.type.includes(filetype)), false);

            if (!fileAccepted) {
                ShowErrorToast("This file is not an accepted image format");
                return;
            }
            console.log(event.target.files[0]);
            setImage(event.target.files[0]);
        }
        else {
            setImage(null);
        }
    }

    const [prodPurch, setProdPurch] = useState<ProductPurch[]>([]);
    const [product, setProduct] = useState(0);
    const [client, setClient] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isQuantityValid, setQuantityValid] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [date, setDate] = React.useState(moment());
    const imageURL = useMemo(() => { return image ? URL.createObjectURL(image) : imagePreview }, [image]);
    const [errorToast, setErrorToast] = useState<string>("");
    const [showError, setShowError] = useState(false);
    const [discountValid, setDiscountValid] = useState(true);

    function ShowErrorToast(error: string) {
        setShowError(true);
        setErrorToast(error);
    }

    function SendInvoice() {
        if (prodPurch.length < 1) {
            ShowErrorToast("There are no products added to this invoice");
            return;
        }

        if (!discountValid) {
            ShowErrorToast("The discount amount is not allowed");
            return;
        }

        date.hour(0);
        date.minute(0);
        date.second(0);
        date.millisecond(0);
        console.log("Loggind date with hours zeroed in: ", date);
        console.log("Image?", image);
        const invoice: NewInvoice = {
            clientEmail: clients[client].email,
            date: date.valueOf(),
            discount: discount,
            products: prodPurch.map<NewProdPurch>((prod) => {
                return {
                    id: prod.id,
                    quantity: prod.quantity
                }
            }),
            image: image ? image : undefined
        }

        onCreateInvoice(invoice);
        CloseDialog();
    }

    function ParseNumber(userNum: string): number {
        let num = Number.parseInt(userNum);
        num = (num === undefined || Number.isNaN(num) || num < 0) ? 0 : num;

        return num;
    }

    function ValidDiscount(num: number, clientIdx: number) {
        const currClient = clients[clientIdx];
        setDiscountValid(num <= currClient.allowedDiscount);
        setDiscountError(num <= currClient.allowedDiscount ? "" : "Discount for this client can't be more than " + currClient.allowedDiscount);
    }

    function ValidQuantity(num: number) {
        setQuantityValid(num > 0);
    }

    function EditProductAmount(i: number, value: string) {
        let num = Math.max(ParseNumber(value), 1);

        setProdPurch([
            ...prodPurch.slice(0, i),
            {
                ...prodPurch[i],
                quantity: num
            },
            ...prodPurch.slice(i + 1)
        ])

    }

    function AddProductToList() {
        if (!isQuantityValid) {
            ShowErrorToast("This amount is invalid");
            return;
        }

        const currProduct = products[product];

        let newProd: ProductPurch = {
            id: currProduct.id,
            name: currProduct.name,
            quantity: quantity,
            unitPrice: currProduct.price
        }

        let foundIdx = prodPurch.findIndex((prod: ProductPurch) => {
            return (prod.id == currProduct.id)
        });

        if (foundIdx > -1) {
            newProd.quantity += prodPurch[foundIdx].quantity;
            setProdPurch([
                ...prodPurch.slice(0, foundIdx),
                newProd,
                ...prodPurch.slice(foundIdx + 1)
            ]);
        }
        else {
            setProdPurch([
                ...prodPurch,
                newProd
            ]);
        }


    }

    function DeleteProductFromList(i: number) {
        setProdPurch([
            ...prodPurch.slice(0, i),
            ...prodPurch.slice(i + 1)
        ])
    }

    function CloseDialog() {
        console.log("Closing dialog!");
        setProdPurch([]);
        setDate(moment());
        setQuantity(1);
        setDiscount(0);
        setClient(0);
        setProduct(0);
        setImage(null);
        setDiscountError("");
    }

    return (
        <Dialog open={isOpen} fullWidth maxWidth='lg' fullScreen={!isBig} scroll={"paper"} PaperProps={{ sx: { borderRadius: isBig ? 5 : 0 } }} keepMounted={false}>
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                message={errorToast}
                onClose={() => setShowError(false)}
            />
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', marginInline: 'auto' }} dividers>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', maxWidth: '40em' }}>
                    <DialogTitle variant='h6'>User Details</DialogTitle>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', flexDirection: 'column', gap: theme.spacing(1) }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: theme.spacing(2), flexWrap: 'wrap' }}>
                            <DatePicker label="Date" sx={{ width: '18em' }}
                                value={date}
                                onChange={(newValue) => setDate(newValue!)} />
                            <TextField sx={{ width: '18em' }}
                                id="client-selector"
                                select
                                label="Clients"
                                helperText="Click on a client"
                                value={client.toString()}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    let num = ParseNumber(event.target.value);
                                    setClient(num);
                                    ValidDiscount(discount, num);
                                }}
                            >
                                {clients.map((client, index) => (
                                    <MenuItem key={index} value={index}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="discount-field"
                                label="Discount"
                                type="number"
                                error={discountError.length > 0}
                                helperText={discountError}
                                sx={{ width: '18em' }}
                                value={discount.toString()}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    let num = ParseNumber(event.target.value);
                                    ValidDiscount(num, client);
                                    console.log("Validating: ", num);
                                    setDiscount(num);
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: theme.spacing(1), width: '18em' }}>
                                <TextField sx={{ flex: 2 }}
                                    id="product-selector"
                                    select
                                    label="Products"
                                    value={product.toString()}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setProduct(ParseNumber(event.target.value));
                                    }}>
                                    {products.map((prod, index) => (
                                        <MenuItem key={index} value={index}>
                                            {prod.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    id="quantity-field"
                                    type="number"
                                    error={!isQuantityValid}
                                    sx={{ flex: 1 }}
                                    value={quantity.toString()}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        let num = ParseNumber(event.target.value);
                                        setQuantity(num);
                                        ValidQuantity(num);
                                    }}
                                />
                                <Button size="small" sx={{ flex: 1 }} variant="contained" onClick={AddProductToList}><AddIcon /></Button>
                            </Box>
                        </Box>
                        <Box sx={{ maxWidth: '35em', marginTop: theme.spacing(1), display: 'flex', alignSelf: 'center', width: '100%' }}>
                            <InvoiceDialogProducts rows={prodPurch} onClickDelete={DeleteProductFromList} onAmountUpdate={EditProductAmount}></InvoiceDialogProducts>
                        </Box>
                    </Box>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }} />
                <Box sx={{ flex: 0.25, minWidth: '15em', display: 'flex', flexDirection: 'column', marginBottom: theme.spacing(2) }}>
                    <DialogTitle variant='h6'>Voucher</DialogTitle>
                    <Box sx={{ padding: theme.spacing(2), width: "100%", aspectRatio: 1 / 1 }}><img src={imageURL} style={{ width: '100%', aspectRatio: 1 / 1, objectFit: 'scale-down' }} /></Box>
                    <Button
                        size="small" variant="contained"
                        sx={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2), justifyContent: 'center' }}
                        component="label">
                        UPLOAD IMAGE
                        <input
                            onChange={onImageChange} className="filetype"
                            accept=".png,.jpeg,.jpg"
                            type="file" hidden />
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" variant="contained" onClick={() => { CloseDialog(); onClickClose(); }} sx={{borderRadius: 8}}>Cancel</Button>
                <Button variant="contained" onClick={SendInvoice} disabled={prodPurch.length < 1} type="submit" sx={{borderRadius: 8}}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceDialog;
