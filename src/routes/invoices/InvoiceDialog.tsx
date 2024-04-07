import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Divider, Button, useTheme, MenuItem, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DatePicker, DatePickerToolbar } from '@mui/x-date-pickers';
import InvoiceDialogProducts from './InvoiceDialogProducts';
import ImageIcon from '@mui/icons-material/Image';
import { Client, NewInvoice, NewProdPurch, PostInvoice, Product, ProductPurch } from '../../api/Aim';
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

    const UserState = useContext(AuthContext);
    
    const [prodPurch, setProdPurch] = useState<ProductPurch[]>([]);
    const [product, setProduct] = useState(0);
    const [client, setClient] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [isQuantityValid, setQuantityValid] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [date, setDate] = React.useState(moment());

    let isDiscountValid = true;

    function SendInvoice(){
        if(!isDiscountValid)
            return;

        console.log("Logging date: ", date);
        date.hour(0);
        date.minute(0);
        date.second(0);
        date.millisecond(0);
        console.log("Loggind date with hours zeroed in: ", date);
        const invoice: NewInvoice = {
            clientEmail : clients[client].email,
            date : date.valueOf(),
            discount : discount,
            products : prodPurch.map<NewProdPurch>((prod)=>{return {
                id:prod.id,
                quantity:prod.quantity
            }})
        }

        onCreateInvoice(invoice);
        CloseDialog();
    }

    function ParseNumber(userNum: string): number{
        let num = Number.parseInt(userNum);
        num = (num === undefined || Number.isNaN(num) || num < 0) ? 0 : num;
        
        return num;
    }

    function ValidDiscount(num: number, clientIdx: number){
        const currClient = clients[clientIdx];
        isDiscountValid = num<=currClient.allowedDiscount;
        setDiscountError(isDiscountValid ? "" :  "Discount for this client can't be more than " + currClient.allowedDiscount);
    }

    function ValidQuantity(num: number){
        setQuantityValid(num>0);
    }

    function AddProductToList(){
        if(!isQuantityValid)
            return;

        const currProduct = products[product];

        let newProd: ProductPurch = {
            id: currProduct.id,
            name: currProduct.name,
            quantity: quantity,
            unitPrice: currProduct.price
        }

        let foundIdx = prodPurch.findIndex((prod: ProductPurch)=>{
            return(prod.id == currProduct.id)});

        if(foundIdx >-1){
            newProd.quantity += prodPurch[foundIdx].quantity;
            setProdPurch([
                ...prodPurch.slice(0, foundIdx),
                newProd,
                ...prodPurch.slice(foundIdx+1)
              ]);
        }
        else{
            setProdPurch([
                ...prodPurch,
                newProd
            ]);
        }

        
    }

    function DeleteProductFromList(i: number){
        setProdPurch([
            ...prodPurch.slice(0, i),
            ...prodPurch.slice(i+1)
        ])
    }

    function CloseDialog(){
        console.log("Closing dialog!");
        setProdPurch([]);
        setDate(moment());
        setQuantity(1);
        setDiscount(0);
        setClient(0);
        setProduct(0);
    }

    return (
        <Dialog open={isOpen} fullWidth maxWidth='lg' PaperProps={{ sx: { borderRadius: 5 } }} keepMounted={false}>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogContent sx={{ display: 'flex' }}>
                <Box sx={{ flex: 3, display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
                    <DialogTitle variant='h6'>User Details</DialogTitle>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', flexDirection: 'column', gap: theme.spacing(1) }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: theme.spacing(3) }}>
                            <DatePicker label="Date" sx={{ flex: 1, marginLeft: theme.spacing(3) }} 
                            value={date}
                            onChange={(newValue) => setDate(newValue!)}/>
                            <TextField sx={{ flex: 1, marginRight: theme.spacing(3) }}
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
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: theme.spacing(2) }}>
                            <TextField
                                id="discount-field"
                                label="Discount"
                                type="number"
                                error={discountError.length>0}
                                helperText={discountError}
                                sx={{ flex: 1, marginLeft: theme.spacing(3) }}
                                value={discount.toString()}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        let num = ParseNumber(event.target.value);
                                        setDiscount(num);
                                        ValidDiscount(num, client);
                                      }}
                            />
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: theme.spacing(1), marginRight: theme.spacing(3) }}>
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
                                <Button size="small" sx={{ flex: 0.5 }} variant="contained" onClick={AddProductToList}><AddIcon /></Button>
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1, marginLeft: theme.spacing(4), marginRight: theme.spacing(4), marginTop: theme.spacing(1), alignSelf:'center'}}>
                            <InvoiceDialogProducts rows={prodPurch} onClickDelete={DeleteProductFromList}></InvoiceDialogProducts>
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'left', gap: theme.spacing(3), marginTop: theme.spacing(2), marginLeft: theme.spacing(3) }}>
                            <Button variant="contained" onClick={SendInvoice}>Add</Button>
                            <Button color="secondary" variant="contained" onClick={()=>{CloseDialog();onClickClose();}}>Cancel</Button>
                        </Box>
                    </Box>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle variant='h6'>Voucher</DialogTitle>
                    <Box sx={{ overflow: 'hidden', margin: theme.spacing(2)  }}><img src={'/photo_upload.png'} style={{ width: "100%", height: "100%", alignSelf: "center" }} /></Box>
                    <Button size="small" variant="contained" sx={{ marginLeft: theme.spacing(2) }}>UPLOAD IMAGE</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceDialog;
