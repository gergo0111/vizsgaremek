import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
                     <h1>{munka?.munka_neve}</h1>
                     <h2>Előrehaladás</h2>
                     
              </div>
       );
}