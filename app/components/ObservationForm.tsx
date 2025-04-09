'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locations, Location } from '../lib/locations';

// Define the enum values
const OBSERVATION_TYPE = {
  SAFETY: 'SAFETY',
  QUALITY: 'QUALITY',
  ENVIRONMENT: 'ENVIRONMENT',
} as const;

const SAFETY_CATEGORIES = {
  HAZARD: 'HAZARD',
  INCIDENT: 'INCIDENT',
  NEAR_MISS: 'NEAR_MISS',
  IMPROVEMENT: 'IMPROVEMENT',
  GOOD_PRACTICE: 'GOOD_PRACTICE',
} as const;

const QUALITY_CATEGORIES = {
  POTENTIAL_NONCONFORMITY: 'POTENTIAL_NONCONFORMITY',
  IMPROVEMENT: 'IMPROVEMENT',
  GOOD_PRACTICE: 'GOOD_PRACTICE',
} as const;

const OBSERVATION_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export default function ObservationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedLocations(selectedValues);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      type: formData.get('type'),
      category: formData.get('category'),
      severity: formData.get('severity'),
      description: formData.get('description'),
      locations: selectedLocations,
      photos: []
    };

    try {
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit observation');
      }

      setSuccess(true);
      const form = e.currentTarget;
      if (form) {
        form.reset();
        setSelectedType('');
        setSelectedLocations([]);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit observation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Submit New Observation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg animate-fade-in">
              Observation submitted successfully!
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-100 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Title"
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">Description</label>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-100 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Description"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              required
              value={selectedType}
              onChange={handleTypeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100"
            >
              <option value="">Select a type</option>
              <option value={OBSERVATION_TYPE.SAFETY}>Safety</option>
              <option value={OBSERVATION_TYPE.QUALITY}>Quality</option>
              <option value={OBSERVATION_TYPE.ENVIRONMENT}>Environment</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100"
            >
              <option value="">Select a category</option>
              {selectedType === OBSERVATION_TYPE.QUALITY ? (
                <>
                  <option value={QUALITY_CATEGORIES.POTENTIAL_NONCONFORMITY}>Potential Nonconformity</option>
                  <option value={QUALITY_CATEGORIES.IMPROVEMENT}>Improvement</option>
                  <option value={QUALITY_CATEGORIES.GOOD_PRACTICE}>Good Practice</option>
                </>
              ) : (
                <>
                  <option value={SAFETY_CATEGORIES.HAZARD}>Hazard</option>
                  <option value={SAFETY_CATEGORIES.INCIDENT}>Incident</option>
                  <option value={SAFETY_CATEGORIES.NEAR_MISS}>Near Miss</option>
                  <option value={SAFETY_CATEGORIES.IMPROVEMENT}>Improvement</option>
                  <option value={SAFETY_CATEGORIES.GOOD_PRACTICE}>Good Practice</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100"
            >
              <option value="">Select severity</option>
              <option value={OBSERVATION_SEVERITY.LOW}>Low</option>
              <option value={OBSERVATION_SEVERITY.MEDIUM}>Medium</option>
              <option value={OBSERVATION_SEVERITY.HIGH}>High</option>
              <option value={OBSERVATION_SEVERITY.CRITICAL}>Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="locations" className="block text-sm font-medium text-gray-700">
              Locations
            </label>
            <select
              id="locations"
              name="locations"
              multiple
              value={selectedLocations}
              onChange={handleLocationChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-48 bg-gray-100"
              required
            >
              {locations.map((location: Location) => (
                <option key={location.code} value={location.code}>
                  {location.code} - {location.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Hold Ctrl (Windows) or Command (Mac) to select multiple locations
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Observation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
