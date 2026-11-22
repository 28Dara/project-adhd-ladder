import { Route, Routes } from "react-router-dom";
import About from "../pages/About/About";
import Landing from "../pages/Landing/Landing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
