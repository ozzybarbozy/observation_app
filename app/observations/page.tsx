'use client';

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { siteConfig } from "../config/site";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

interface Observation {
  id: string;
  title: string;
  type: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  photos: {
    url: string;
  }[];
}

async function fetchObservations() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/observations`);
  if (!response.ok) {
    throw new Error('Failed to fetch observations');
  }
  return response.json();
}

export default async function ObservationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const observations: Observation[] = await fetchObservations();

  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{siteConfig.name}</h1>
          <p className="text-gray-500 mt-2">{siteConfig.description}</p>
        </div>

        <div className="mb-6 flex space-x-4">
          <Link href="/">
            <button className="flex-shrink-0 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Enter New Observation
            </button>
          </Link>
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold">All Observations</h2>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {observations.map((observation) => (
              <ObservationCard key={observation.id} observation={observation} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {observations.map((observation) => (
              <ObservationListItem key={observation.id} observation={observation} />
            ))}
          </div>
        )}

        {observations.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No observations found.
          </div>
        )}
      </div>
    </div>
  );
} 