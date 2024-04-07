import React, { createContext, useState} from 'react';

export const AuthContext = createContext<UserState|null>(null);

//User state setter and getter
export type UserState = {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  };

type UserData = {
    email?: string;
    isClient?: boolean;
    name?:string;
    password?: string;
    sessionToken?: string;
  };

//Provider object that sets the user authentication data provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<UserData>({
        email: undefined,
        password: undefined,
        sessionToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFpbWVkZ2UuY29tIiwiaWF0IjoxNzEyNDcyNjc0LCJleHAiOjE3MTI0NzYyNzR9.VJz4cEA-UtFs4n9Xh9JdHM16NKFGjboLQDP0GgmcUi8",
        name: "Federico",
        isClient: false,
    });
  
    return (
      <AuthContext.Provider value={{userData, setUserData}}>
        {children}
      </AuthContext.Provider>
    );
  };