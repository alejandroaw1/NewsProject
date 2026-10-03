import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

