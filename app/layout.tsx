import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "VPL SELECTION TRAILS",
};

// ✅ SAME auction members as backend
const AUCTIONS = [
  { name: "vamsi", startingBid: 2000 },
  { name: "mahesh", startingBid: 1400 },
  { name: "sai", startingBid: 1100 },
  { name: "dhana", startingBid: 1800},
  { name: "chandu", startingBid: 900 },
  { name: "sudhakar", startingBid: 1300 },
  { name: "madhu", startingBid: 1000 },
  { name: "dinesh", startingBid: 800 },
  { name: "sivakoti", startingBid: 1200 },
  { name: "munirao", startingBid: 1700 },
  { name: "venky", startingBid: 700 },
  { name: "vinay", startingBid: 600 },
  { name: "ramesh", startingBid: 1600},
  { name: "raja", startingBid: 1500},
  { name: "mohan", startingBid: 1900 },
  { name: "vinod", startingBid: 500 },
  { name: "malli", startingBid: 400 },
  { name: "munibabu", startingBid: 300 },
  { name: "sivakumar", startingBid: 200 },
  { name: "b_sai", startingBid: 100 },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: 20 }}>
        <h1 className="app-title">VPL SELECTION TRAILS</h1>
        <nav
          style={{
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {AUCTIONS.map((name) => (
            <Link
              key={name.name}
              href={`/auctions/${name.name}`}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "#f3f4f6",
                textDecoration: "none",
                color: "#111827",
                fontSize: 14,
              }}
            >
              {name.name.charAt(0).toUpperCase() + name.name.slice(1)}
            </Link>
          ))}
        </nav>

        {children}
      </body>
    </html>
  );
}
