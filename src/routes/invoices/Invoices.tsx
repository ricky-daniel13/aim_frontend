import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
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
import { Client, GetClients, GetInvoices, GetProducts, Invoice, Logout, NewInvoice, PostInvoice, Product, ProductPurch } from '../../api/Aim';
import { AuthContext } from '../../context/AuthContext';
import InvoicesProducts from './InvoicesProducts';
import { Navigate, useNavigate } from 'react-router-dom';

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


const Invoices: React.FC = () => {
    const [invData, setInvData] = useState<Invoice[]>([]);
    const [invCount, setInvCount] = useState<number>(0);
    const [prodData, setProdData] = useState<Product[]>([]);
    const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
    const [clientData, setClientData] = useState<Client[]>([]);
    const [isLoading, setLoading] = useState(false);

    const UserState = useContext(AuthContext);
    const navigate = useNavigate();

    async function GetData() {
        if (UserState?.userData.authToken == null)
            return;
        await LoadInvoice(0);


        if (UserState?.userData.isClient)
            return;
        try{setLoading(true);
        setLoading(true);
        const prods = await GetProducts(UserState!);
        setProdData(prods!);

        const clients = await GetClients(UserState!);
        setClientData(clients!);
        setLoading(false);}
        catch{
            Logoff();
        }
    }

    async function LoadInvoice(page: number) {
        try{setLoading(true);
            const invoices = await GetInvoices(UserState!, page, 5);
            setInvData(invoices!.invoices);
            setInvCount(invoices!.rowCount);
            setLoading(false);}
        catch{
            Logoff();
        }
        
    }

    async function SendInvoice(inv: NewInvoice) {

        setInvDiagOpen(false);
        setLoading(true);
        await PostInvoice(UserState!, inv);
        const invoices = await GetInvoices(UserState!, 0, 5);
        setInvData(invoices!.invoices);
        setInvCount(invoices!.rowCount);
        setLoading(false);
    }

    function Logoff(){
        Logout(UserState!, navigate);
    }

    useEffect(() => {
        // Getbooks on mount
        GetData();
    }, []);


    const theme = useTheme();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isInvDiagOpen, setInvDiagOpen] = useState(false);

    if (UserState?.userData.authToken == undefined) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    else
        return (
            <Box sx={{ display: 'flex' }} minWidth={"100vw"} minHeight={"100vh"} component="main">
                <CssBaseline />
                <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
                <InvoicesProducts isOpen={selectedInv != null} invoice={selectedInv} onClickClose={() => { setSelectedInv(null) }}></InvoicesProducts>
                <InvoiceDialog isOpen={isInvDiagOpen} products={prodData} clients={clientData} onClickClose={() => { setInvDiagOpen(false) }} onCreateInvoice={SendInvoice}></InvoiceDialog>
                <AimAppBar drawerWidth={drawerWidth} onOpenDrawer={() => { setDrawerOpen(true) }}></AimAppBar>
                <ThemeProvider theme={darkTheme}>
                    <AimDrawer open={isDrawerOpen} drawerWidth={drawerWidth} onClose={() => { setDrawerOpen(false); }} onLogout={Logoff}></AimDrawer>
                </ThemeProvider>
                <Box sx={{ flex: 1 }}>
                    <Toolbar />
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: theme.spacing(3) }}>
                        <Paper elevation={1} sx={{ padding: theme.spacing(3), margin: theme.spacing(1), flex: 0.75, borderRadius: 8 }}>
                            {!UserState?.userData.isClient && <Button variant="contained" style={{ marginBottom: theme.spacing(1), borderRadius: 20 }} startIcon={<AddIcon />} onClick={() => { setInvDiagOpen(true) }}>CREATE INVOICE</Button>}
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

export default Invoices;
