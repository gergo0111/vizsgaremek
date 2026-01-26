import { useNavigate } from "react-router"

export function UserManagement() {
       const navigate = useNavigate();
       
       

       return <>
              <tr>
                     <td>Felhasználó neve</td>
                     <td>Munkacsoport</td>
              </tr>
              <button onClick={() => navigate("/uj-felhasznalo")}>⊕Új felhasználó</button>
       </>
}