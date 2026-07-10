import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import DriversPage from "./pages/DriversPage";
import CircuitsPage from "./pages/CircuitsPage";
import RacesPage from "./pages/RacesPage";
 
export default function App() {
  const [activePage, setActivePage] = useState("home");
 
  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const renderPage = () => {
    switch (activePage) {
      case "drivers":   return <DriversPage />;
      case "circuits":  return <CircuitsPage />;
      case "races":     return <RacesPage />;
      default:          return <Dashboard navigate={navigate} />;
    }
  };
 
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#080810" }}>
      <Header activePage={activePage} navigate={navigate} />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
}
 

