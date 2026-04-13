/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Munka {
       munka_id: number;
       munka_neve: string;
       eszkoz_id: number;
       user_id: number;
       ertesitesIsActive: boolean;
       isActive: boolean;
       kezdeti_datum: string;
       varhato_befejezesi_datum: string;
}

interface Feladat {
       feladat_id: number;
       munka_id: number;
       leiras: string;
       isCompleted: boolean;
       isActive: boolean;
}

export function WorkUpdate() {

       const navigate = useNavigate();
       const munka_id = window.location.pathname.split("/").pop();
       const [munka, setMunka] = useState(null);
       const [feladatok, setFeladatok] = useState([]);

       const fetchMunka = async () => {
              try {
                     const response = await fetch(`http://localhost:3000/munka/${munka_id}`);
                     if (!response.ok) {
                            throw new Error('Hiba történt a munka lekérésekor');
                     }
                     const data = await response.json();
                     setMunka(data);
              } catch (error) {
                     console.error('Hiba:', error);
              }   
       };
       
       const fetchFeladatok = async () => {
              try {
                     const response = await fetch(`http://localhost:3000/feladatok/${munka_id}`);
                     if (!response.ok) {
                            throw new Error('Hiba történt a feladatok lekérésekor');
                     }
                     const data = await response.json();
                     setFeladatok(data);
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       useEffect(() => {
              fetchMunka();
              fetchFeladatok();
       }, []);

       return (
              <div>
                     <form></form>
                            <label>
                                   Munka neve:
                                   <input
                                          type="text"
                                          value={munka?.munka_neve || ""}
                                          onChange={(e) => setMunka({...munka, munka_neve: e.target.value})}
                                   />
                            </label>
                            <br />
                            <label>
                                   Kezdeti dátum:
                                   <input
                                          type="date"
                                          value={munka?.kezdeti_datum || ""}
                                          onChange={(e) => setMunka({...munka, kezdeti_datum: e.target.value})}
                                   />
                            </label>
                            <br />
                            <label>
                                   Várható befejezési dátum:
                                   <input
                                          type="date"
                                          value={munka?.varhato_befejezesi_datum || ""}
                                          onChange={(e) => setMunka({...munka, varhato_befejezesi_datum: e.target.value})}
                                   />
                            </label>
                            <label>
                                   Aktív:
                                   <input
                                          type="checkbox"
                                          checked={munka?.isActive || false}
                                          onChange={(e) => setMunka({...munka, isActive: e.target.checked})}
                                   />
                            </label>
                            <label>
                                   Értesítés aktív:
                                   <input
                                          type="checkbox"
                                          checked={munka?.ertesitesIsActive || false}
                                          onChange={(e) => setMunka({...munka, ertesitesIsActive: e.target.checked})}
                                   />
                            </label>
                            <label>
                                   
                            </label>
                     </form>
              </div>
       );
}*/