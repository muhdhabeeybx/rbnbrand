import { AppProvider } from "./contexts/AppContext";
import { Router } from "./components/Router";

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}