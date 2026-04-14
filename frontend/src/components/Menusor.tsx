import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";
import ptlogo from "../assets/ptlogo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';


export function Menusor() {
  
       const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

       return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "#084885" }}
      >
        <img src={ptlogo} alt="P&T Pasztik logo" className="logo" onClick={() => navigate('/fooldal')} />
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <button
                className="nav-link"
                style={{ color: "white" }}
                onClick={() => navigate("/felhasznalok-kezelese")}
              >
                Felhasználók kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" 
              style={{ color: "white" }}
              onClick={() => navigate("/eszkozok")}>
                Gépek kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{ color: "white" }}>
                Munkák módosítása
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{ color: "white" }} onClick={() => navigate("/uj-munka")}>
                ⊕ Új munka
              </button>
            </li>
          </ul>

          <div className="ml-auto d-flex align-items-center">
            <button
              className="btn btn-link"
              onClick={handleLogout}
              style={{ color: "white", textDecoration: 'none' }}
              aria-label="Kijelentkezés"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
