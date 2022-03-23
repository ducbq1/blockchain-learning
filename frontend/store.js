import React, { useState } from "react";

export const StoreContext = React.createContext();

export default function MyStore({ children }) {
    const [accounts, setAccounts] = useState([]);
    // const [coinbase, setCoinbase] = useState("");
    // const [address, setAddress] = useState(new Set());
    const [address, setAddress] = useState([]);
    // const [signature, setSignature] = useState(new Set());
    const [signature, setSignature] = useState([]);
    // const [signature, setSignature] = useState(new Map());
    // const [message, setMessage] = useState("");
    // const [currentAddressContract, setCurrentAddressContract] = useState("");

    const store = {
        accountContext: [accounts, setAccounts],
        addressContext: [address, setAddress],
        signatureContext: [signature, setSignature],
        // coinbaseContext: [coinbase, setCoinbase]
        // messageContext: [message, setMessage],
        // currentAddressContractContext: [currentAddressContract, setCurrentAddressContract]
    }

    return (<StoreContext.Provider value={store} > {children} </StoreContext.Provider>)
}