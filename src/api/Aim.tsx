
import { NavigateFunction } from "react-router-dom";
import { UserState } from "../context/AuthContext";
import ExtError from "../library/ExtError";

export const API_URL = 'http://localhost:3000';

type LoginDTO = {
  name: string;
  authToken: string;
  isClient: boolean;
};

export const DoLogin = async (
  email: string,
  password: string,
): Promise<LoginDTO | null> => {

    console.log('Starting net request');
    const response = await fetch(API_URL+"/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:email,password:password}),
    });

    if (response.status == 401) {
      throw new ExtError(response.statusText, 'Incorrect Login Data.', 'The password or email you entered are incorrect. Check if you\'ve written them correctly and try again.');
    } else if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      console.log('Network data gotten!');
    }

    const data : LoginDTO = await response.json();
    // Handle the response data
    console.log(data);

    return data;

};

export type ProductPurch = {
    id: number;
    quantity: number;
    unitPrice: number;
    name: string
  };

export type Invoice = {
  id: number;
  clientName: string;
  clientEmail: string;
  date: number;
  discount: number;
  imageUrl?: string;
  products: ProductPurch[]
};

export type InvoiceDTO = {
  rowCount: number;
  invoices: Invoice[];
};

export const Logout = (
  userState: UserState,
  navigate: NavigateFunction
) => {
    userState.setUserCookie('user',null);
    userState.setUserData({});
    navigate('/');
};


export const GetInvoices = async (
  userState: UserState,
  page: number,
  limit: number
): Promise<InvoiceDTO | null> => {
    console.log('Starting invoices request');
    if(!userState.userData.authToken)
        return null;
    const response = await fetch(API_URL + "/invoices?" + new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
  }), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userState.userData.authToken}`
      },
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      ('Network data gotten!');
    }

    const data: InvoiceDTO = await response.json();

    console.log(data);
    return data;
};

export type NewProdPurch = {
  id: number;
  quantity: number;
};

export type NewInvoice = {
  clientEmail: string;
  date: number;
  discount: number;
  products: NewProdPurch[]
  image?: File
};

export type NewInvoiceDTO = {
  clientEmail: string;
  date: number;
  discount: number;
  products: NewProdPurch[]
};

export const PostInvoice = async (
  userState: UserState,
  invoice: NewInvoice,
): Promise<void> => {

    console.log('Preparing post invoice');

    const invoiceDTO:NewInvoiceDTO = {
      ...invoice
    }

    console.log("JSON data:" + invoiceDTO);

    const response = await fetch(API_URL+"/invoices", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.authToken}`
      },
      body: JSON.stringify(invoiceDTO)
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      console.log('Network data gotten!');
    }

    console.log("Image? ", invoice.image);

    if(invoice.image){

      const results = await response.json();

      let fileData = new FormData();
      fileData.append('file',invoice.image);

      const responseImage = await fetch(API_URL+"/invoices/"+results.id+"/image/", {
        headers: {
          'Authorization': `Bearer ${userState.userData.authToken}`
        },
        method: 'POST',
        body: fileData
      });

      console.log(responseImage);
    }

    return;
};

export type Product = {
  id: number;
  name: string;
  price: number;
};

export const GetProducts = async (
  userState: UserState,
): Promise<Product[] | null> => {
    console.log('Starting products request');
    if(!userState.userData.authToken)
        return [];
    const response = await fetch(API_URL + "/products", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.authToken}`
      },
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      ('Network data gotten!');
    }

    const data: Product[] = await response.json();
    return data;
};

export type Client = {
  email: string;
  name: string;
  allowedDiscount: number;
};

export const GetClients = async (
  userState: UserState,
): Promise<Client[] | null> => {
    console.log('Starting products request');
    if(!userState.userData.authToken)
        return [];
    const response = await fetch(API_URL + "/clients", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.authToken}`
      },
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      ('Network data gotten!');
    }

    const data: Client[] = await response.json();
    return data;
};