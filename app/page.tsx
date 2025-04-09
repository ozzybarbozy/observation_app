import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import ObservationForm from "./components/ObservationForm";
import { siteConfig } from "./config/site";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{siteConfig.name}</h1>
          <p className="text-gray-500 mt-2">{siteConfig.description}</p>
        </div>
        <ObservationForm />
        <div className="mt-6">
          <Link href="/observations">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View Observations
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
