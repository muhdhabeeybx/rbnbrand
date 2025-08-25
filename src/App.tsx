import { AppProvider } from "./contexts/AppContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { Router } from "./components/Router";

export default function App() {
  return (
    <AppProvider>
      <CurrencyProvider>
        <Router />
      </CurrencyProvider>
    </AppProvider>
  );
}