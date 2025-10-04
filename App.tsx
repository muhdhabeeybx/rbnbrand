import React from 'react';
import { AppProvider } from "./contexts/AppContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { Router } from "./components/Router";
import "./styles/globals.css";

export default function App() {
  return (
    <CurrencyProvider>
      <CustomerProvider>
        <AppProvider>
          <Router />
        </AppProvider>
      </CustomerProvider>
    </CurrencyProvider>
  );
}