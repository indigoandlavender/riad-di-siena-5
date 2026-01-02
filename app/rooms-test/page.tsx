"use client";

import { useState, useEffect } from "react";
import SimpleBookingModal from "@/components/SimpleBookingModal";

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Image_URL: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/sheets/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-serif mb-8">Rooms (Test Version)</h1>
      
      <div className="space-y-8 max-w-2xl">
        {rooms.map((room) => (
          <div key={room.Room_ID} className="border p-6">
            <h2 className="font-serif text-xl mb-2">{room.Name}</h2>
            <p className="text-gray-600 mb-4">{room.Description}</p>
            <p className="mb-4">€{room.Price_EUR} / night</p>
            <button
              onClick={() => {
                setSelectedRoom(room);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-black text-white"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <SimpleBookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
          }}
          roomName={selectedRoom.Name}
          priceEUR={parseFloat(selectedRoom.Price_EUR)}
        />
      )}
    </div>
  );
}
