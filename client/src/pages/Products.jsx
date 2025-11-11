import { useEffect, useState } from "react";
import { api } from "../api";

export default function Products() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function fetchItems() {
    api.get("/products").then(r => setItems(r.data));
  }

  useEffect(fetchItems, []);

  function addProduct() {
    api.post("/products", { name, price })
      .then(() => { setName(""); setPrice(""); fetchItems(); })
      .catch(() => alert("Only dataentry/admin can add products"));
  }

  function deleteProduct(id) {
    api.delete(`/products/${id}`)
      .then(fetchItems)
      .catch(() => alert("Only admin can delete products"));
  }

  return (
    <div className="space-y-6 w-full ">
      <h2 className="text-2xl font-semibold">Products</h2>

      <div className="flex gap-3">
        <input className="border p-2 rounded" placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 rounded w-28" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded" onClick={addProduct}>Add</button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.product_id} className="border-t hover:bg-gray-50">
              <td className="p-3">{p.product_id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.price}</td>
              <td className="p-3"><button className="text-red-600" onClick={() => deleteProduct(p.product_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
