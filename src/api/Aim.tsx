
import { UserState } from "../context/AuthContext";
import ExtError from "../library/ExtError";

export const API_URL = 'http://localhost:3000';

type LoginReturn = {
  userToken: string;
  o_u: string;
  sessionToken: string;
};

export const DoLogin = async (
  email: string,
  password: string,
): Promise<LoginReturn | null> => {

    console.log('Starting net request');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        req: 'createOauthkey',
        login: email,
        pwd: password,
      }).toString(),
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      console.log('Network data gotten!');
    }

    const data = await response.json();
    // Handle the response data
    console.log(data);

    if (data.status == 'nok') {
      console.log("Nok status in data.");
      if (data.error.includes('invalid login/pwd')) {
        console.log('Bad login data, returning');
        throw new ExtError(data.error, 'Incorrect Login Data.', 'Please check your login data and try again.');
      } else 
      throw new ExtError(data.error, 'Unknown Server Error.', 'Please try again later.');
    }

    const sessionToken = await DoSession(data.o_u, data.oauthkey);

    return {
      userToken: data.oauthkey,
      o_u: data.o_u,
      sessionToken: sessionToken!,
    };
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


export const GetInvoices = async (
  userState: UserState,
  page: number,
  limit: number
): Promise<InvoiceDTO | null> => {
    console.log('Starting invoices request');
    if(!userState.userData.sessionToken)
        return null;
    const response = await fetch(API_URL + "/invoices?" + new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
  }), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.sessionToken}`
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
};

export const PostInvoice = async (
  userState: UserState,
  invoice: NewInvoice,
): Promise<void> => {

    console.log('Preparing post invoice');

    const response = await fetch(API_URL+"/invoices", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.sessionToken}`
      },
      body: JSON.stringify(invoice)
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      console.log('Network data gotten!');
    }
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
    if(!userState.userData.sessionToken)
        return [];
    const response = await fetch(API_URL + "/products", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.sessionToken}`
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
    if(!userState.userData.sessionToken)
        return [];
    const response = await fetch(API_URL + "/clients", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState.userData.sessionToken}`
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

export const DoSession = async (
  o_u: string,
  userToken: string,
): Promise<string | null> => {
    console.log('Starting session request');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        req: 'createSesskey',
        o_u: o_u,
        oauthkey: userToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new ExtError(response.statusText, 'Network Error', 'There was an error contacting the server. Check your internet connection or try again later.');
    } else {
      ('Network data gotten!');
    }

    const data = await response.json();
    console.log(data);

    if (data.status == 'nok') throw new ExtError(data.error, 'Unknown Server Error.', 'Please try again later.');

    return data.sesskey;

};