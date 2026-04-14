import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Munka } from "../../interfaces/Munka";
import { Menusor } from "../Menusor";
import 'bootstrap/dist/css/bootstrap.min.css';

interface MunkaLista {
    munka_neve: string;
    leiras: string;
    eszkoz_id: string;
    dolgozo_id: string;
    kezdeti_datum: string;
    varhato_befejezesi_datum: string;
}


export function WorkList() {
        const [works, setWorks] = React.useState<Munka[]>([]);
        
        const [munka_neve, SetMunkaNeve] = useState('');
        const [leiras, SetLeiras] = useState('');
        const [eszkoz_id, SetEszkoz_id] = useState('');
        const [dolgozo_id, SetDolgozo_id] = useState('');
        const [kezdeti_datum, SetKezdetiDatum] = useState('');
        const [varhato_befejezesi_datum, SetVelemenyDatum] = useState('');
        const [feladatok, SetFeladatok] = useState('');
        const navigate = useNavigate();    

         useEffect(() => {
                const fetchWorks = async () => {
                       try {
                              const response = await fetch('http://localhost:3000/munka');
                              if (!response.ok) {
                                     throw new Error('Hiba történt a munkák lekérésekor');
                              }
                              const data = await response.json();
                              setWorks(data);
                       } catch (error) {
                              console.error('Hiba:', error);
                       }   
                };
                fetchWorks();
         }, [])

         return <>
            <Menusor></Menusor>
                       <table>
                              <tbody>
                                     {works.map((work) => (
                                            <tr key={work.munka_id}>
                                                   <div className="card" style={{ width: '18rem' }}>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{work.munka_neve}</h5>
                                                            <p className="card-text">{work.leiras}</p>
                                                            <p className="card-text">Eszköz ID: {work.eszkoz_id}</p>
                                                            <p className="card-text">Dolgozó ID: {work.dolgozo_id}</p>
                                                            <p className="card-text">Kezdeti dátum: {work.kezdeti_datum}</p>
                                                            <p className="card-text">Várható befejezési dátum: {work.varhato_befejezesi_datum}</p>
                                                            <p className="card-text">Feladatok: {work.feladatok}</p>
                                                            <button aria-label={`Szerkesztés ${work.munka_neve}`} onClick={() => navigate(`/munka-modositas/${work.munka_id}`)} >✏️</button>
                                                        </div>
                                                    </div>
                                            </tr>
                                     ))}
                              </tbody>
                       </table>
         </>
}

export default WorkList;
