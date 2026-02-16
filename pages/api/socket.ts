import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

/* ✅ REQUIRED for Socket.IO on Vercel / serverless */
export const config = {
  api: {
    bodyParser: false,
  },
};

/* ================= TYPES ================= */

type Auction = {
  bid: number;
  bids: { name: string; amount: number }[];
  highestBidder: string | null;
};

type SocketServer = HTTPServer & {
  io?: IOServer;
};

type SocketWithServer = NetSocket & {
  server: SocketServer;
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: SocketWithServer;
};

/* ================= AUCTION DATA ================= */

const AUCTION_MEMBERS = [
  { name: "vamsi", startingBid: 2000 },
  { name: "mahesh", startingBid: 1400 },
  { name: "sai", startingBid: 1100 },
  { name: "dhana", startingBid: 1800 },
  { name: "chandu", startingBid: 900 },
  { name: "sudhakar", startingBid: 1300 },
  { name: "madhu", startingBid: 1000 },
  { name: "dinesh", startingBid: 800 },
  { name: "sivakoti", startingBid: 1200 },
  { name: "munirao", startingBid: 1700 },
  { name: "venky", startingBid: 700 },
  { name: "vinay", startingBid: 600 },
  { name: "ramesh", startingBid: 1600 },
  { name: "raja", startingBid: 1500 },
  { name: "mohan", startingBid: 1900 },
  { name: "vinod", startingBid: 500 },
  { name: "malli", startingBid: 400 },
  { name: "munibabu", startingBid: 300 },
  { name: "sivakumar", startingBid: 200 },
  { name: "b_sai", startingBid: 100 },
];

const auctions: Record<string, Auction> = {};

/* ✅ Initialize auctions once */
AUCTION_MEMBERS.forEach(({ name, startingBid }) => {
  auctions[name] = {
    bid: startingBid,
    bids: [],
    highestBidder: null,
  };
});

/* ================= API HANDLER ================= */

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const server = res.socket.server;

  if (!server.io) {
    console.log("Starting Socket.IO server...");

    const io = new IOServer(server, {
      path: "/api/socket",
    });

    server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      /* ================= JOIN AUCTION ================= */
      socket.on("join-auction", (auctionName: string) => {
        const auctionKey = auctionName.toLowerCase();
        const auction = auctions[auctionKey];

        if (!auction) {
          socket.emit("auction-error", "Auction not found");
          return;
        }

        socket.join(auctionKey);
        socket.emit("auction-update", auction);
      });

      /* ================= PLACE BID ================= */
      socket.on(
        "place-bid",
        ({
          auctionName,
          name,
          amount,
        }: {
          auctionName: string;
          name: string;
          amount: number;
        }) => {
          const auctionKey = auctionName.toLowerCase();
          const auction = auctions[auctionKey];

          if (!auction) return;

          // ❌ Same captain trying again
          if (auction.highestBidder === name) {
            socket.emit(
              "auction-error",
              `${name} already has the highest bid`
            );
            return;
          }

          // ❌ Bid too low or equal
          if (amount <= auction.bid) {
            socket.emit(
              "auction-error",
              "Bid must be higher than current bid"
            );
            return;
          }

          // ✅ Accept bid
          auction.bid = amount;
          auction.highestBidder = name;
          auction.bids.push({ name, amount });

          io.to(auctionKey).emit("auction-update", auction);
        }
      );

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
