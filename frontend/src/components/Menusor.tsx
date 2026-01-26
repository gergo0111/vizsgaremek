import ptlogo from '../assets/ptlogo.svg';

export function Menusor() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#084885' }}>
        <img src={ptlogo} alt="P&T Pasztik logo" className="logo" />
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
              <button className="nav-link" style={{color: "white"}}>
                Felhasználók kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{color: "white"}}>
                Gépek kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{color: "white"}}>
                Munkaerő kezelése
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{color: "white"}}>
                Munkák módosítása
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" style={{color: "white"}}>
                ⊕Új munka
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
