import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menusor } from "../Menusor";

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

export function ModifyWork() {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Hiba történt a felhasználók lekérésekor");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const response = await fetch("http://localhost:3000/eszkozok");
        if (!response.ok) {
          throw new Error("Hiba történt az eszközök lekérésekor");
        }
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error("Hiba:", error);
      }
    };

    const fetchWorkData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/munka/${munka_id}`);
        if (!response.ok) {
          throw new Error("Hiba történt a munka adatainak lekérésekor");
        }
        const data = await response.json();
        
        const kezdeti = data.kezdeti_datum 
          ? new Date(data.kezdeti_datum).toISOString().split('T')[0] 
          : "";
        const varhato = data.varhato_befejezes_datuma 
          ? new Date(data.varhato_befejezes_datuma).toISOString().split('T')[0] 
          : "";
        
        setWorkData({
          ...data,
          kezdeti_datum: kezdeti,
          varhato_befejezes_datuma: varhato,
        });
        
        setSelectedUsers(data.user_id ? [data.user_id] : []);
        setSelectedTools(data.eszkoz_id ? [data.eszkoz_id] : []);
        setSelectedTasks(data.feladat ? data.feladat.map((f: any) => f.leiras) : [""]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (index: number, value: number) => {
    setSelectedUsers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addUser = () => {
    setSelectedUsers((prev) => [...prev, 0]);
  };

  const removeUser = (index: number) => {
    setSelectedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToolChange = (index: number, value: number) => {
    setSelectedTools((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addTool = () => {
    setSelectedTools((prev) => [...prev, 0]);
  };

  const removeTool = (index: number) => {
    setSelectedTools((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, value: string) => {
    setSelectedTasks((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addTask = () => {
    setSelectedTasks((prev) => [...prev, ""]);
  };

  const removeTask = (index: number) => {
    setSelectedTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      munka_neve: workData.munka_neve,
      leiras: workData.leiras,
      kezdeti_datum: workData.kezdeti_datum || undefined,
      varhato_befejezes_datuma: workData.varhato_befejezes_datuma || undefined,
      user_id: selectedUsers[0] || undefined,
      eszkoz_id: selectedTools[0] || undefined,
      feladatok: selectedTasks.filter((t) => t && t.trim() !== ""),
    };

    try {
      const res = await fetch(`http://localhost:3000/munka/${munka_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Hiba a mentéskor", text);
        return;
      }

      navigate("/fooldal");
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }

  return (
    <>
      <Menusor />
      <div className="new-work-page">
        <div className="new-work-card">
          <h2 className="new-work-header">Munka módosítása</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Munka neve:</label>
              <input
                className="form-control"
                type="text"
                name="munka_neve"
                value={workData.munka_neve}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Leírás:</label>
              <textarea
                className="form-control"
                name="leiras"
                value={workData.leiras || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Kezdeti dátum:</label>
              <input
                className="form-control"
                type="date"
                name="kezdeti_datum"
                value={workData.kezdeti_datum || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Várható befejezés dátuma:</label>
              <input
                className="form-control"
                type="date"
                name="varhato_befejezes_datuma"
                value={workData.varhato_befejezes_datuma || ""}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div>
              <label>Dolgozó:</label>
              {selectedUsers.map((userId, idx) => (
                <div key={idx} className="dynamic-row">
                  <select
                    value={userId}
                    onChange={(e) =>
                      handleUserChange(idx, parseInt(e.target.value || "0", 10) || 0)
                    }
                  >
                    <option value={0}>-- válassz --</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.nev}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => removeUser(idx)}>
                    Törlés
                  </button>
                </div>
              ))}
              <button type="button" onClick={addUser}>
                Új dolgozó hozzáadása
              </button>
            </div>
            <br />
            <div>
              <label>Eszköz:</label>
              {selectedTools.map((toolId, idx) => (
                <div key={idx} className="dynamic-row">
                  <select
                    value={toolId}
                    onChange={(e) =>
                      handleToolChange(idx, parseInt(e.target.value || "0", 10) || 0)
                    }
                  >
                    <option value={0}>-- válassz --</option>
                    {tools.map((tool) => (
                      <option key={tool.eszkoz_id} value={tool.eszkoz_id}>
                        {tool.nev}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => removeTool(idx)}>
                    Törlés
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTool}>
                Új eszköz hozzáadása
              </button>
            </div>
            <br />
            <div>
              <label>Feladatok:</label>
              {selectedTasks.map((task, idx) => (
                <div key={idx} className="dynamic-row">
                  <input
                    className="form-control"
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(idx, e.target.value)}
                    placeholder="Feladat"
                  />
                  <button type="button" onClick={() => removeTask(idx)}>
                    Törlés
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTask}>
                Új feladat hozzáadása
              </button>
            </div>
            <br />
            <button type="submit" style={{ marginRight: "10px" }}>
              Mentés
            </button>
            <button
              type="button"
              onClick={() => navigate("/fooldal")}
              style={{ backgroundColor: "#6c757d" }}
            >
              Mégse
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ModifyWork;