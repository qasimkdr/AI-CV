import AppRoutes from "./routes/AppRoutes";
import ScrollManager from "./components/ScrollManager";
import { Toaster } from "./components/Toaster";

function App() {
  return (
    <>
      <ScrollManager />
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
