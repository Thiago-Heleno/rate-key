import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import ServicesPage from "@/pages/ServicesPage";
import ApiKeyPage from "@/pages/ApiKeyPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: "relative", width: "100%" }}
      >
        <Routes location={location}>
          <Route path="/" element={<ServicesPage />} />
          <Route path="/api_key" element={<ApiKeyPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HashRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <Toaster />
    </HashRouter>
  );
}

export default App;
