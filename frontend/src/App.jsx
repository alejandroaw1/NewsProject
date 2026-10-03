import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";

function App() {
    return(
        <BrowserRouter>
            <Navbar />
            <Home />;
        </BrowserRouter>
    );
}

export default App;

