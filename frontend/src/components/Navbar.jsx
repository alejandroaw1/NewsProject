import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo">
                    NEWS PORTAL
                </Link>

                <nav className="navbar-menu">
                    <Link to="/" className="navbar-link">
                        Inicio
                    </Link>

                    <Link to="/categorias" className="navbar-link">
                        Categorías
                    </Link>

                    <Link to="/buscar" className="navbar-link">
                        Buscar
                    </Link>

                    <Link to="/login" className="navbar-login">
                        Iniciar sesión
                    </Link>
                </nav>

            </div>
        </header>
    );
}

export default Navbar;