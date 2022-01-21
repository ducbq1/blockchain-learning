import React, { useState } from "react";

export const StoreContext = React.createContext();

export default function MyStore({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [address, setAddress] = useState(new Set());
    const [signature, setSignature] = useState(new Set());
    const [message, setMessage] = useState("");

    const store = {
        accountContext: [accounts, setAccounts],
        addressContext: [address, setAddress],
        signatureContext: [signature, setSignature],
        messageContext: [message, setMessage]
    }

    return (<StoreContext.Provider value={store} > {children} </StoreContext.Provider>)
}