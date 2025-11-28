"use client";
import { useEffect, useState } from "react";

export default function TestIconRendersPage() {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fcmobileforum.com/_functions/getIconRenders")
      .then((res) => res.json())
      .then((data) => {
        console.log("ICON RENDERS:", data);
        setIcons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Icon Renders</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {icons.map((item) => (
          <div
            key={item._id}
            style={{
              background: "#111",
              padding: 10,
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <img
              src={item.image}
              alt={item.renders || "icon"}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "contain",
              }}
            />
            <p style={{ color: "white", marginTop: 8 }}>
              {item.renders || "Unnamed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
