'use client'; // This component is a Client Component

import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../config/site";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const session = getServerSession(authOptions); // Fetch session on the client

  return (
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
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <nav className={`md:flex ${isMenuOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col md:flex-row md:space-x-4">
            <li>
              <Link href="/observations" className="text-gray-700 hover:text-blue-600">
                Observations List
              </Link>
            </li>
            {session && <li><SignOutButton /></li>}
          </ul>
        </nav>
      </div>
    </header>
  );
} 