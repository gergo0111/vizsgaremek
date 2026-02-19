import React, { useEffect } from "react";
import { Menusor } from "../Menusor";

export function NewWorkAdd() {
       
       const [users, SetUsers] = React.useState([]);
       const [tools, SetTools] = React.useState([]);
       const [tasks, SetTasks] = React.useState([]);
       const [nev, SetNev] = React.useState('');
       const [leiras, SetLeiras] = React.useState('');
       const [dolgozok, SetDolgozok] = React.useState([]);
       const [eszkozok, SetEszkozok] = React.useState([]);
       const [kezdetiDatum, SetKezdetiDatum] = React.useState('');
       const [velemenyDatum, SetVelemenyDatum] = React.useState('');

       useEffect(() => {
              const fetchUsers = async () => {
                     try {
                            const response = await fetch('http://localhost:3000/users');
                            if (!response.ok) {
                                   throw new Error('Hiba történt a felhasználók lekérésekor');
                            }
                            const data = await response.json();
                            SetUsers(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }   
              };

              const fetchTools = async () => {
                     try {
                            const response = await fetch('http://localhost:3000/eszkozok');
                            if (!response.ok) {
                                   throw new Error('Hiba történt az eszközök lekérésekor');
                            }
                            const data = await response.json();
                            SetTools(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }
              };
              
              fetchUsers();
              fetchTools();
       }, []);

       const PlusUser = () => {
              //meg egy sectiont nyit a formban ahol tud valasztani meg tobb dolgozot

       }

       const PlusEszkoz = () => {
              //meg egy sectiont nyit a formban ahol tud valasztani meg tobb eszkozt
       }

       const PlusFeladat = () => {
              //meg egy sectiont nyit a formban ahol tud valasztani meg tobb feladatot
       }

       const handleSubmit = () => {
              
       }

       return(
              <>
              <Menusor></Menusor>
              <h1>Új munka hozzáadása</h1>
              <form>
                     <div>
                            <label>Munka neve:</label>
                            <input type="text" />
                     </div>
                     <div>
                            <label>Leírás:</label>
                            <input type="text" />
                     </div>
                     <div>
                            <label>Dolgozó kiválasztása:</label>
                            <select>
                                   {users.map((user) => (
                                          <option key={user.user_id} value={user.user_id}>
                                                 {user.nev}
                                          </option>
                                   ))}
                            </select>
                            <button onClick={() => PlusUser()}>Új dolgozó hozzáadása</button>
                     </div>
                     <div>
                            <label>Eszközök kiválasztása:</label>
                            <select>
                                   {tools.map((tool) => (
                                          <option key={tool.tool_id} value={tool.tool_id}>
                                                 {tool.nev}
                                          </option>
                                   ))}
                            </select>
                            <button onClick={() => PlusEszkoz()}>Új eszköz hozzáadása</button>
                     </div>
                     <div>
                            <label>Munka kezdeti dátuma:</label>
                            <input type="date" />
                     </div>
                     <div>
                            <label>Munka várható befejezési dátuma:</label>
                            <input type="date" />
                     </div>
                     <div>
                            <label>Feladatok megadása:</label>
                            <input type="text" />
                            <button onClick={() => PlusFeladat()}>Új feladat hozzáadása</button>
                     </div>
                     <div>
                            <button onClick={() => handleSubmit()}>Munka mentése</button>
                     </div>
              </form>
              </>
       )

}


