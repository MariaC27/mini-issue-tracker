// ABOUTME: Root layout wrapping the app with ClerkProvider and global nav.
// ABOUTME: All pages inherit this layout.

import type { Metadata } from "next";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mini Issue Tracker",
  description: "A simple issue tracking app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background font-sans antialiased">
          <header className="border-b px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              Issue Tracker
            </Link>
            <div>
              {userId ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal" />
              )}
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
