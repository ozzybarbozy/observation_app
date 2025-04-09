import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import SignOutButton from "./components/SignOutButton";
import { Providers } from "./providers";
import { siteConfig } from "./config/site";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={siteConfig.logo}
                    alt={`${siteConfig.company} logo`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{siteConfig.name}</h1>
                  <p className="text-base text-gray-500">{siteConfig.company}</p>
                </div>
              </div>
              {session && <SignOutButton />}
            </div>
          </header>
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} {siteConfig.company}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    GitHub
                  </a>
                  <a
                    href={siteConfig.links.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
