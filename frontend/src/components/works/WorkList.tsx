import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet } from "../../lib/api";
import { apiDelete } from "../../lib/api";
import "bootstrap/dist/css/bootstrap.min.css";

interface WorkData {
  munka_id: number;
  munka_neve: string;
  leiras?: string;
  kezdeti_datum?: string;
  varhato_befejezes_datuma?: string;
  user_id?: number;
  eszkoz_id?: number;
  feladat?: Array<{ feladat_id: number; leiras: string }>;
}

interface UserData {
  user_id: number;
  nev: string;
}

interface EszkozData {
  eszkoz_id: number;
  nev: string;
}

export function WorkList() {
  const [works, setWorks] = useState<WorkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allWorks, setAllWorks] = useState<WorkData[]>([]);
  const [users, SetUsers] = useState<UserData[]>([]);
  const [tools, SetTools] = useState<EszkozData[]>([]);
  const [nev, SetNev] = useState("");
  const [leiras, SetLeiras] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await apiGet<WorkData[]>("/munka");
        const normalized = data.map((work) => ({
          ...work,
          kezdeti_datum: work.kezdeti_datum
            ? new Date(work.kezdeti_datum).toISOString().split("T")[0]
            : "",
          varhato_befejezes_datuma: work.varhato_befejezes_datuma
            ? new Date(work.varhato_befejezes_datuma)
                .toISOString()
                .split("T")[0]
            : "",
        }));
        setWorks(normalized);
      } catch (error) {
        console.error("Hiba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<UserData[]>("/users");
        SetUsers(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const data = await apiGet<EszkozData[]>("/eszkozok");
        SetTools(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    fetchUsers();
    fetchTools();
  }, []);

  const deleteWork = async (workId: number) => {
    if (!Number.isFinite(workId) || workId <= 0) {
      console.warn("Invalid workId, skip delete:", workId);
      return;
    }
    try {
      await apiDelete(`/munka/${workId}`);
      setWorks((prev) => prev.filter((work) => work.munka_id !== workId));
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setWorks(allWorks);
      return;
    }
    const filteredWorks = allWorks.filter(
      (work) =>
        work.munka_neve.toLowerCase().includes(term) ||
        work.leiras?.toLowerCase().includes(term),
    );
    setWorks(filteredWorks);
  };

  useEffect(() => {
    setAllWorks(works);
  }, [works]);

  return (
    <>
      <Menusor />

      <div className="container py-4">
        <h2 className="mb-4">Munkák</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Kereséshez írj be egy nevet vagy típust"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍
          </button>
        </div>

        {loading ? (
          <p>Betöltés...</p>
        ) : works.length === 0 ? (
          <p>Nincsenek megjeleníthető munkák.</p>
        ) : (
          <div className="row gy-4">
            {works.map((work) => (
              <div key={work.munka_id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{work.munka_neve}</h5>
                    <p className="card-text">{work.leiras || "Nincs leírás"}</p>
                  </div>

                  <ul className="list-group list-group-flush">
                    <div className="card-body">
                      <h6>Alkalmazottak:</h6>
                      <ul className="mb-0">
                        {users
                          .filter((user) => work.user_id === user.user_id)
                          .map((user) => (
                            <li key={user.user_id}>{user.nev}</li>
                          ))}
                      </ul>
                    </div>
                  </ul>

                  <ul className="list-group list-group-flush">
                    <div className="card-body">
                      <h6>Eszközök:</h6>
                      <ul className="mb-0">
                        {tools
                          .filter((tool) => work.eszkoz_id === tool.eszkoz_id)
                          .map((tool) => (
                            <li key={tool.eszkoz_id}>{tool.nev}</li>
                          ))}
                      </ul>
                    </div>
                  </ul>

                  {work.feladat && work.feladat.length > 0 && (
                    <div className="card-body">
                      <h6>Feladatok:</h6>
                      <ul className="mb-0">
                        {work.feladat.map((task) => (
                          <li key={task.feladat_id}>{task.leiras}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Kezdete: {work.kezdeti_datum || "-"}
                    </li>
                    <li className="list-group-item">
                      Várható befejezés: {work.varhato_befejezes_datuma || "-"}
                    </li>
                  </ul>
                  
                  <div className="card-body">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/munka-modositas/${work.munka_id}`)
                      }
                    >
                      Szerkesztés
                    </button>

                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Biztosan törlöd ${work.munka_neve} munkát?`,
                          )
                        ) {
                          deleteWork(work.munka_id);
                        }
                      }}
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default WorkList;
