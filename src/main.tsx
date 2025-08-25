import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// import fonts
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/onest/400.css";

createRoot(document.getElementById("root")!).render(<App />);
