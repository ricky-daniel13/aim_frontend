import React, { createContext, useState} from 'react';
import { useLocalStorage } from "../hooks/UseLocalStorage";

export const AuthContext = createContext<UserState|null>(null);

//User state setter and getter
export type UserState = {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
    setUserCookie: any;
  };



type UserData = {
    email?: string;
    isClient?: boolean;
    name?:string;
    password?: string;
    authToken?: string;
  };

//Provider object that sets the user authentication data provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
    const [userCookie, setUserCookie] = useLocalStorage("user", null);
    const [userData, setUserData] = useState<UserData>({
        email: userCookie ? userCookie.email : null,
        password: userCookie ? userCookie.password : null,
        authToken: userCookie ? userCookie.authToken : null,
        name: userCookie ? userCookie.name : null,
        isClient: userCookie ? userCookie.isClient : true,
    });
  
    return (
      <AuthContext.Provider value={{userData, setUserData, setUserCookie}}>
        {children}
      </AuthContext.Provider>
    );
  };