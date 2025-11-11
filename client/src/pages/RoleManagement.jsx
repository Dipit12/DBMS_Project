import { useEffect, useState } from "react";
import { api } from "../api";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "" });


  function fetchUsers() {
    api.get("/admin/users").then(r => setUsers(r.data));
  }
  useEffect(fetchUsers, []);

  function assignRole(user_id) {
    if (!role.trim()) return alert("Enter a role first.");
    api.post("/admin/assign-role", { user_id, role_name: role }).then(fetchUsers);
    
  }

  async function createUser() {
    if (!newUser.role) return alert("Select a role.");
  
    try {
      // Step 1: Create the user
      await api.post("/auth/register", {
        username: newUser.username,
        password: newUser.password
      });
  
      // Step 2: Fetch the user_id of newly created user
      const res = await api.get("/admin/users");
      const created = res.data.find(u => u.username === newUser.username);
  
      // Step 3: Assign selected role
      await api.post("/admin/assign-role", {
        user_id: created.user_id,
        role_name: newUser.role
      });
  
      // Reset
      setNewUser({ username: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      alert("Error: Username may already exist.");
    }
  }
  

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold">Role Management</h2>

     {/* Create User Form */}
<div className="bg-amber-200 glass soft-shadow p-6 rounded-xl w-[420px]">
  <h3 className="font-semibold mb-4">Create New User</h3>

  <input
    className="border p-2 rounded w-full mb-2"
    placeholder="Username"
    value={newUser.username}
    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
  />

  <input
    className="border p-2 rounded w-full mb-4"
    type="password"
    placeholder="Password"
    value={newUser.password}
    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
  />

  {/* Role Dropdown */}
  <select
    className=" border p-2 rounded w-full mb-4"
    value={newUser.role}
    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
  >
    <option value="">Select Role</option>
    <option value="admin">Admin</option>
    <option value="auditor">Auditor</option>
    <option value="dataentry">Data Entry</option>
    <option value="guest">Guest</option>
  </select>

  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    onClick={createUser}
  >
    Create User
  </button>
</div>


      {/* Assign Role */}
      <input className="border p-2 rounded w-80" placeholder="admin / auditor / dataentry / guest" onChange={e => setRole(e.target.value)} />
    <div className = "overflow-y-auto max-h-[60vh]">
       <table className="w-full glass soft-shadow rounded-xl">
        <thead>
          <tr className="bg-white/20 text-left">
            <th className="p-3">User</th>
            <th className="p-3">Roles</th>
            <th className="p-3 w-32">Assign</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id} className="hover:bg-white/10">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.roles.join(", ") || "No Role"}</td>
              <td className="p-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => assignRole(u.user_id)}>
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     
    </div>
  );
}
