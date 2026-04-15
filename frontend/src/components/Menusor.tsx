import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../lib/auth";
import ptlogo from "../assets/ptlogo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
 
 
export function Menusor() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#084885" }}
    >
      <div className="container-fluid">
        <img 
          src={ptlogo} 
          alt="P&T Pasztik logo" 
          className="logo navbar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/fooldal')} 
        />
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
            <li className="nav-item">
              <button className="nav-link text-white border-0 bg-transparent" onClick={() => navigate("/felhasznalok-kezelese")}>
                Felhasználók kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link text-white border-0 bg-transparent" onClick={() => navigate("/eszkozok")}>
                Gépek kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link text-white border-0 bg-transparent" onClick={() => navigate("/munka-lista")}>
                Munkák módosítása
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link text-white border-0 bg-transparent" onClick={() => navigate("/uj-munka")}>
                ⊕ Új munka
              </button>
            </li>
          </ul>

          <div className="navbar-nav">
            <button
              className="nav-link text-white border-0 bg-transparent"
              onClick={handleLogout}
              style={{ textDecoration: 'none' }}
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}