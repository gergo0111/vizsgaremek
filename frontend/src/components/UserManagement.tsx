import { useNavigate } from "react-router"
import UsersList from "./UsersList";

export function UserManagement() {
       const navigate = useNavigate();
       
       

       return <>
              <UsersList />
              <button onClick={() => navigate("/uj-felhasznalo")}>⊕Új felhasználó</button>
       </>
}