import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { User } from "../../interfaces/User";
import { Menusor } from "../Menusor";
import { apiGet, apiDelete } from "../../lib/api";

export function UsersList() {
       const [users, setUsers] = React.useState<User[]>([]);
       const navigate = useNavigate();

       useEffect(() => {
              const fetchUsers = async () => {
                     try {
                            const data = await apiGet<User[]>('/users');
                            setUsers(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }   
              };

              fetchUsers();
       }, []);

       const deleteUser = async (userId: number) => {
              if (!Number.isFinite(userId) || userId <= 0) {
                     console.warn('Invalid userId, skip delete:', userId);
                     return;
              }
              try {
                     await apiDelete(`/users/${userId}`);
                     setUsers(prev => prev.filter(user => user.user_id !== userId));
              } catch (error) {
                     console.error('Hiba:', error);
              }
       };

       
       return <>
              <Menusor></Menusor>
              <table>
                     <thead>
                            <tr>
                                   <th>Felhasználó neve</th>
                                   <th>Munkacsoport</th>
                            </tr>
                     </thead>
                     <tbody>
                            {users.map((user) => (
                                   <tr key={user.user_id}>
                                          <td>{user.nev}</td>
                                          <td>{user.munkakor}</td>
                                          <td>
                                                 <button aria-label={`Szerkesztés ${user.nev}`} onClick={() => navigate(`/felhasznalo-modositas/${user.user_id}`)} >✏️</button>
                                          </td>
                                          <td>
                                                 <button
                                                        aria-label={`Törlés ${user.nev}`}
                                                        onClick={() => {
                                                               if (window.confirm(`Biztosan törlöd ${user.nev} felhasználót?`)) {
                                                                      deleteUser(user.user_id);
                                                               }
                                                        }}
                                                 >
                                                        ❌
                                                 </button>
                                          </td>
                                   </tr>
                            ))}
                     </tbody>
              </table>
       </>
}

export default UsersList;