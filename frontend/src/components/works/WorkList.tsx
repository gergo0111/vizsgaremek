import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menusor } from "../Menusor";
import { apiGet, apiPatch } from "../../lib/api";
import "bootstrap/dist/css/bootstrap.min.css";


interface User {
  user_id: number;
  nev: string;
}

interface Tool {
  eszkoz_id: number;
  nev: string;
}

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

export function WorkList() {
  const { munka_id } = useParams<{ munka_id: string }>();

  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [workData, setWorkData] = useState<WorkData>({
    munka_id: 0,
    munka_neve: "",
    leiras: "",
    kezdeti_datum: "",
    varhato_befejezes_datuma: "",
    user_id: undefined,
    eszkoz_id: undefined,
    feladat: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([""]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const data = await apiGet<Tool[]>("/eszkozok");
        setTools(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchWorkData = async () => {
      try {
        const data = await apiGet<WorkData>(`/munka/${munka_id}`);

        const kezdeti = data.kezdeti_datum
          ? new Date(data.kezdeti_datum).toISOString().split("T")[0]
          : "";
        const varhato = data.varhato_befejezes_datuma
          ? new Date(data.varhato_befejezes_datuma).toISOString().split("T")[0]
          : "";

        setWorkData({
          ...data,
          kezdeti_datum: kezdeti,
          varhato_befejezes_datuma: varhato,
        });

        setSelectedUsers(data.user_id ? [data.user_id] : []);
        setSelectedTools(data.eszkoz_id ? [data.eszkoz_id] : []);
        setSelectedTasks(
          data.feladat ? data.feladat.map((f: any) => f.leiras) : [""],
        );
        setLoading(false);
      } catch (error) {
        console.error("Hiba:", error);
        setLoading(false);
      }
    };

    fetchUsers();
    fetchTools();
    fetchWorkData();
  }, [munka_id]);

  return (
    <>
      <Menusor></Menusor>
      {workData.map((workdata) => (
        <div key={workData.munka_id}>
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{workData.munka_neve}</h5>
          <p className="card-text">{workData.leiras}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{workData.kezdeti_datum}</li>
          <li className="list-group-item">
            {workData.varhato_befejezes_datuma}
          </li>
        </ul>
        <div className="card-body">
          <a>
            <td>
              <button
                aria-label={`Szerkesztés ${workData.munka_neve}`}
                onClick={() =>
                  navigate(`/munka-modositas/${workData.munka_id}`)
                }
              >
                ✏️
              </button>
            </td>
            <td>
              <button
                aria-label={`Törlés ${workData.munka_neve}`}
                onClick={() => {
                  if (
                    window.confirm(`Biztosan törlöd ${workData.munka_neve} munkát?`)
                  ) {
                    deleteWork(workData.munka_id);
                  }
                }}
              >
                ❌
              </button>
            </td>
          </a>
        </div>
      </div>
       </div>
      ))}
    </>
)};

export default WorkList;
