import React, { useEffect } from "react";
import { User } from "../interfaces/User";

export function UsersList() {
       const [users, setUsers] = React.useState<User[]>([]);

       useEffect(() => {
              const fetchUsers = async () => {
                     try {
                            const response = await fetch('http://localhost:3000/users');
                            if (!response.ok) {
                                   throw new Error('Hiba történt a felhasználók lekérésekor');
                            }
                            const data = await response.json();
                            setUsers(data);
                     } catch (error) {
                            console.error('Hiba:', error);
                     }
              };
              
              fetchUsers();
       }, []);

       
       return <>
              <table>
                     <thead>
                            <tr>
                                   <th>Felhasználó neve</th>
                                   <th>Munkacsoport</th>
                            </tr>
                     </thead>
                     <tbody>
                            {users.map((user) => (
                                   <tr key={user.id}>
                                          <td>{user.nev}</td>
                                          <td>{user.munkakor}</td>
                                   </tr>
                            ))}
                     </tbody>
              </table>
       </>
}

export default UsersList;