import React, { useState } from 'react';

const initialZones = [
    { name: 'Zone 1', capacity: 10, users: [] },
    { name: 'Zone 2', capacity: 5, users: [] },
    { name: 'Zone 3', capacity: 3, users: [] }
];

export default function ZoneAllocator() {
    const [zones, setZones] = useState(initialZones);
    const [userCount, setUserCount] = useState(1);
    const [message, setMessage] = useState('');

    const allocateUser = () => {
        const newZones = [...zones];
        const userName = `User ${userCount}`;

        const allocated = newZones.find(zone => zone.users.length < zone.capacity);

        if (allocated) {
            allocated.users.push(userName);
            setZones(newZones);
            setUserCount(prev => prev + 1);
            setMessage(`${userName} allocated to ${allocated.name}`);
        } else {
            setMessage(`All zones are full. Cannot allocate ${userName}`);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Zone Allocator (AIVA)</h2>

            <button
                onClick={allocateUser}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Allocate New User
            </button>

            <p className="mt-4 text-green-700 font-medium">{message}</p>

            <div className="mt-6 space-y-4">
                {zones.map((zone, idx) => (
                    <div key={idx} className="border p-3 rounded">
                        <h3 className="font-bold text-black">{zone.name}</h3>
                        <p>
                            {zone.users.length}/{zone.capacity} users
                        </p>
                        <ul className="list-disc ml-5 text-black">
                            {zone.users.map((user, i) => (
                                <li key={i}>{user}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
