import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { Backdrop, CircularProgress, Paper } from '@mui/material';
import InvoiceTable from './InvoiceTable';
import AimDrawer from '../../components/AimDrawer';
import { useContext, useEffect, useState } from 'react';
import AimAppBar from '../../components/AimAppBar';
import InvoiceDialog from './InvoiceDialog';
import { Client, GetClients, GetInvoices, GetProducts, Invoice, NewInvoice, PostInvoice, Product, ProductPurch } from '../../api/Aim';
import { AuthContext } from '../../context/AuthContext';
import InvoicesProducts from './InvoicesProducts';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#313030',
        },
        secondary: {
            main: '#000000',
        },
    },

});

const drawerWidth = 240;


export default function Invoices() {
    const [invData, setInvData] = useState<Invoice[]>([]);
    const [invCount, setInvCount] = useState<number>(0);
    const [prodData, setProdData] = useState<Product[]>([]);
    const [selectedInv, setSelectedInv] = useState<Invoice|null>(null);
    const [clientData, setClientData] = useState<Client[]>([]);
    const [isLoading, setLoading] = useState(false);

    const UserState = useContext(AuthContext);

    async function GetData(){
        
        
        await LoadInvoice(0);

        if(UserState?.userData.isClient)
            return;
        setLoading(true);
        const prods = await GetProducts(UserState!);
        setProdData(prods!);

        const clients = await GetClients(UserState!);
        setClientData(clients!);
        setLoading(false);
    }

    async function LoadInvoice(page: number){
        setLoading(true);
        const invoices = await GetInvoices(UserState!,page,5);
        setInvData(invoices!.invoices);
        setInvCount(invoices!.rowCount);
        setLoading(false);
    }

    async function SendInvoice(inv: NewInvoice){

        setInvDiagOpen(false);
        setLoading(true);
        await PostInvoice(UserState!, inv);
        const invoices = await GetInvoices(UserState!,0,5);
        setInvData(invoices!.invoices);
        setInvCount(invoices!.rowCount);
        setLoading(false);
    }

    useEffect(() => {
        // Getbooks on mount
        GetData();
    }, []);


    const theme = useTheme();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isInvDiagOpen, setInvDiagOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex' }} minWidth={"100vw"} minHeight={"100vh"}>
            <CssBaseline />
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit"/></Backdrop>
            <InvoicesProducts isOpen={selectedInv!=null} invoice={selectedInv} onClickClose={()=>{setSelectedInv(null)}}></InvoicesProducts>
            <InvoiceDialog isOpen={isInvDiagOpen} products={prodData} clients={clientData} onClickClose={()=>{setInvDiagOpen(false)}} onCreateInvoice={SendInvoice}></InvoiceDialog>
            <AimAppBar drawerWidth={drawerWidth} onOpenDrawer={()=> {setDrawerOpen(true)}}></AimAppBar>
            <ThemeProvider theme={darkTheme}>
                <AimDrawer open={isDrawerOpen} drawerWidth={drawerWidth} onClose={() => { setDrawerOpen(false); }}></AimDrawer>
            </ThemeProvider>
            <Box sx={{ flex: 1 }}>
                <Toolbar />
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: theme.spacing(3)}}>
                    <Paper elevation={1} sx={{ padding: theme.spacing(3), margin: theme.spacing(1), flex: 0.75, borderRadius: 8 }}>
                        {!UserState?.userData.isClient && <Button variant="contained" style={{ marginBottom: theme.spacing(1), borderRadius:20 }} startIcon={<AddIcon />} onClick={()=>{setInvDiagOpen(true)}}>CREATE INVOICE</Button>}  
                        <InvoiceTable
                            rows={invData}
                            totalRowCount={invCount}
                            onPageChange={LoadInvoice}
                            onVoucherClick={() => { }}
                            onProductsClick={(idx: number) => { setSelectedInv(invData[idx]) }}
                        />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
