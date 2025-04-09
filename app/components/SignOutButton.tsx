'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      Sign Out
    </button>
  );
} 