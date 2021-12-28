import React, { useState } from "react";

// export type GlobalContext = {
//     isLoadingContext: any[],
//     accountContext: any[]
// }

export const StoreContext = React.createContext();

export default function MyStore({ children }) {
    const [isLoading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [address, setAddress] = useState(new Set());
    const [signature, setSignature] = useState(new Set());

    const store = {
        isLoadingContext: [isLoading, setLoading],
        accountContext: [accounts, setAccounts],
        addressContext: [address, setAddress],
        signatureContext: [signature, setSignature],
        messageContext: ""
    }

    return (<StoreContext.Provider value={store} > {children} </StoreContext.Provider>)
}