export default async function Home() {
  const res = await fetch("http://localhost:3000/api/data", { cache: "no-store" });
  const data = await res.json();

  return (
    <div>
      <h1>Danh sách dữ liệu</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li> // Thay "name" bằng trường phù hợp trong MongoDB
        ))}
      </ul>
    </div>
  );
}
