import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../lib/auth";
import ptlogo from "../assets/ptlogo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
 
 
export function Menusor() {
  const user = getUser();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin === true;

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

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link nav-button" onClick={() => navigate("/fooldal")}>
                Főoldal
              </button>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <button className="nav-link nav-button" onClick={() => navigate("/felhasznalok-kezelese")}>
                    Felhasználók kezelése
                  </button>
                </li>
                <li className="nav-item">
                  <button className="nav-link nav-button" onClick={() => navigate("/eszkozok")}>
                    Gépek kezelése
                  </button>
                </li>
                <li className="nav-item">
                  <button className="nav-link nav-button" onClick={() => navigate("/munka-lista")}>
                    Munkák módosítása
                  </button>
                </li>
              </>
            )}
          </ul>
      
            <div className="navbar-nav">
              <span className="badge bg-success">
                {user?.nev || 'Kérlek jelentkezz be❗️'}
              </span>
            </div>
          <div className="navbar-nav">
            <button
              className="nav-link nav-button"
              onClick={handleLogout}
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}