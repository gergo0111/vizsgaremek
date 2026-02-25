import { useState } from "react";
import "../../designs/NewToolAdd.css";
import { useNavigate } from "react-router";


export function NewToolAdd() {
       const [nev, setNev] = useState('');
       const [tipus, setTipus] = useState('');
       const [darabszam, setDarabszam] = useState(0);
       const [hasznalatban, setHasznalatban] = useState(false);

       const [errorMsg, setErrorMsg] = useState<string | null>(null);
       const [successMsg, setSuccessMsg] = useState<string | null>(null);
       const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();

              setErrorMsg(null);
              setSuccessMsg(null);

              const newTool = {
                     nev,
                     tipus,
                     darabszam,
                     hasznalatban,
              };

              const errors: Record<string,string> = {};
              if (!nev.trim()) errors.nev = 'Az eszköz nevének megadása kötelező.';
              if (!tipus.trim()) errors.tipus = 'A típus megadása kötelező.';
              if (darabszam < 0) errors.darabszam = 'A darabszám nem lehet negatív.';


              if (Object.keys(errors).length) {
                     setFieldErrors(errors);
                     setErrorMsg('Kérlek javítsd a jelzett mezőket.');
                     return;
              }

              try {
                     const response = await fetch('http://localhost:3000/eszkozok', {
                            method: 'POST',
                            headers: {
                                   'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newTool),
                     });    

                     if (!response.ok) {
                            const errorData = await response.json();
                            const msg = Array.isArray(errorData.message)
                                   ? errorData.message.join(', ')
                                   : (errorData.message ?? JSON.stringify(errorData));
                            setErrorMsg(String(msg));
                            throw new Error('Hiba történt az eszköz hozzáadásakor');
                     }

                     const data = await response.json();
                     console.log('Az eszköz sikeresen hozzáadva:', data);
                     setSuccessMsg('Az eszköz sikeresen hozzáadva.');
                     setFieldErrors({});
                     
                     setNev('');
                     setTipus('');
                     setDarabszam(0);
                     setHasznalatban(false);

              } catch (error) {
                     console.error('Hiba:', error);
              }
       };


       return (
              <div className="new-tool-page">
                     <div className="new-tool-card">
                            <h2 className="new-tool-header">Új eszköz hozzáadása</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                   <div className="form-group">
                                          <label htmlFor="nev">Eszköz neve:</label>
                                          <input className="form-control" type="text" id="nev" name="nev" value={nev} onChange={e => setNev(e.target.value)} placeholder="pl. Monitor" />
                                          {fieldErrors.nev && <div className="field-error">{fieldErrors.nev}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="tipus">Eszköz típusa:</label>
                                          <input className="form-control" type="text" id="tipus" name="tipus" value={tipus} onChange={e => setTipus(e.target.value)} placeholder="pl. programozó" />
                                          {fieldErrors.tipus && <div className="field-error">{fieldErrors.tipus}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="darab">Darabszám:</label>
                                          <input className="form-control" type="number" id="darab" name="darab" value={darabszam} onChange={e => setDarabszam(Number(e.target.value))}/>
                                          {fieldErrors.darabszam && <div className="field-error">{fieldErrors.darabszam}</div>}
                                   </div>

                                   <div className="form-group">
                                          <label htmlFor="permission">Használatban:</label>
                                          <select className="form-control" id="permission" name="permission" value={String(hasznalatban)} onChange={e => setHasznalatban(e.target.value === 'true')} required>
                                                 <option value="true">Igen</option>
                                                 <option value="false">Nem</option>
                                          </select>
                                   </div>

                                   <div className="form-group">
                                          <button className="btn btn-primary" type="submit">Eszköz hozzáadása</button>
                                   </div>
                                   <div className="form-group">
                                          <button onClick={() => navigate("/fooldal")}>Vissza</button>
                                   </div>

                                   {errorMsg && <div className="error-msg">{errorMsg}</div>}
                                   {successMsg && <div className="success-msg">{successMsg}</div>}
                            </form>
                     </div>
              </div>
       )
}