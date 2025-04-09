'use client';

import React, { useEffect, useState } from 'react';
import { Status, ObservationType } from '@prisma/client';

type Observation = {
  id: string;
  type: ObservationType;
  description: string;
  location: string;
  status: Status;
  createdAt: string;
  reporter: {
    name: string;
    email: string;
  };
  photos: {
    url: string;
  }[];
};

export default function ObservationList() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fetch('/api/observations');
        const data = await response.json();
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, []);

  const updateStatus = async (id: string, status: Status) => {
    try {
      const response = await fetch(`/api/observations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setObservations(observations.map(obs => 
          obs.id === id ? { ...obs, status } : obs
        ));
      }
    } catch (error) {
      console.error('Error updating observation:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading observations...</div>;
  }

  return (
    <div className="space-y-4">
      {observations.map((observation) => (
        <div
          key={observation.id}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                observation.type === 'POSITIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {observation.type}
              </span>
              <h3 className="text-lg font-medium mt-2">{observation.location}</h3>
              <p className="text-gray-600 mt-1">{observation.description}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <select
                value={observation.status}
                onChange={(e) => updateStatus(observation.id, e.target.value as Status)}
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <span className="text-sm text-gray-500">
                Reported by: {observation.reporter.name}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(observation.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {observation.photos.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {observation.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`Observation photo ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
