"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import Link from "next/link";

type Bid = {
  name: string;
  amount: number;
};

type AuctionUpdate = {
  bid: number;
  bids: Bid[];
  highestBidder: string | null;
};

export default function AuctionPage() {
  // ✅ Proper param extraction
  const { name } = useParams() as { name: string };

  if (!name) {
    return <p style={{ color: "red" }}>Invalid auction</p>;
  }

  const auctionName = name.toLowerCase();

  const [bidderName, setBidderName] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ensure socket server starts (for Next.js API socket route)
    fetch("/api/socket");

    // Join auction room
    socket.emit("join-auction", auctionName);

    const handleUpdate = (data: AuctionUpdate) => {
      setCurrentBid(data.bid);
      setBids(data.bids);
      setHighestBidder(data.highestBidder);
    };

    const handleError = (msg: string) => {
      setError(msg);
      alert(msg);
    };

    socket.on("auction-update", handleUpdate);
    socket.on("auction-error", handleError);

    return () => {
      socket.emit("leave-auction", auctionName);
      socket.off("auction-update", handleUpdate);
      socket.off("auction-error", handleError);
    };
  }, [auctionName]);

  const placeBid = () => {
    if (!bidderName || !bidAmount) return;

    socket.emit("place-bid", {
      auctionName,
      name: bidderName,
      amount: Number(bidAmount),
    });

    setBidAmount("");
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (currentBid === null) {
    return <p>Loading auction...</p>;
  }

  return (
    <div className="card">
      <h1>Auction: {auctionName.toUpperCase()}</h1>
      <h2>Current Bid: ₹{currentBid}</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div className="select-wrapper">
          <select
            value={bidderName}
            onChange={(e) => setBidderName(e.target.value)}
            className="select-box"
          >
            <option value="" disabled>
              Select Captain
            </option>
            <option value="Manoj">Manoj</option>
            <option value="Karthik">Karthik</option>
          </select>
        </div>

        <input
          placeholder="Bid Price"
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />

        <button
          onClick={placeBid}
          disabled={!bidderName || bidderName === highestBidder}
        >
          Place Bid
        </button>
      </div>

      <h3>Bid History</h3>
      <ul>
        {bids.map((b, i) => (
          <li key={i}>
            <strong>{b.name}</strong> : ₹{b.amount}
          </li>
        ))}
      </ul>

      <nav style={{ marginTop: 20 }}>
        <Link href="/auctions">← Back to Auctions</Link>
      </nav>
    </div>
  );
}
