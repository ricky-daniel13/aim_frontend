import { Routes, Route } from "react-router-dom";
import Invoices from "./routes/invoices/Invoices";
import Login from "./routes/login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> 
      <Route path="/invoices" element={<Invoices />} />
    </Routes>
  );
}

export default App;