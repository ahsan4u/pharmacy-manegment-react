import Header from "./components/Header";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Sales from "./pages/Sells";
import AddMedicine from "./pages/AddMedicine";
import Stock from "./pages/Stock";
import Bill from "./pages/Bill";
import EachBill from "./pages/EachBill";
import { useEffect } from "react";

export default function App() {
  const navigate = useNavigate();
  useEffect(() => window.scrollTo(0, 0), [navigate]);

  useEffect(() => {
    function gotoHome(e) {
      if (e.key == 'Escape') navigate('/');
    }
    document.addEventListener('keydown', gotoHome)

    return () => {
      document.removeEventListener('keydown', gotoHome);
    };
  }, [])


  return (<>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sale" element={<Bill />} />
      <Route path="/add-medicine" element={<AddMedicine />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/sales-book" element={<Sales />} />
      <Route path="/sales/:id" element={<EachBill />} />
    </Routes>
  </>)
}