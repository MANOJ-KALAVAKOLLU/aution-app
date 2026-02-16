import Link from "next/link";

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
  { name: "b_sai", startingBid: 100 }
];

export default function AuctionsListPage() {
  return (
    <div>
      <h1>All Auctions</h1>
      <ul>
        {AUCTIONS.map((name) => (
          <li key={name.name}>
            <Link href={`/auctions/${name.name}`}>
              {name.name.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
