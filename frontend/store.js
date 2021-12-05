import React, { useState } from "react";

// export type GlobalContext = {
//     isLoadingContext: any[],
//     accountContext: any[]
// }

export const StoreContext = React.createContext();

export default function MyStore({ children }) {
    const [isLoading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);

    const store = {
        isLoadingContext: [isLoading, setLoading],
        accountContext: [accounts, setAccounts]
    }

    return (<StoreContext.Provider value={store} > {children} </StoreContext.Provider>)
}