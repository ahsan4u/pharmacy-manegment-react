import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [message, setMessage] = useState('');
    useEffect(() => { if (message) setTimeout(() => setMessage(''), 3000) }, [message])

    return (
        <GlobalContext.Provider value={setMessage}>
            {message && <p className={`text-center fixed top-[10vh] z-50 left-2 px-2 py-2 rounded-md max-w-96 text-wrap overflow-hidden ${message.includes('Successfull') ? 'bg-green-700' : 'bg-red-600'}`}>{message}</p>}
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobalItems() {
    return useContext(GlobalContext);
}