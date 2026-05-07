import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/company/:id" element={<CompanyDetailPage />} />
      </Route>
    </Routes>
  );
}
