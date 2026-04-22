// ABOUTME: Root layout wrapping the app with ClerkProvider and global nav.
// ABOUTME: All pages inherit this layout.

import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Issue Tracker",
  description: "A simple issue tracking app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background font-sans antialiased">
          <header className="border-b px-6 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">
              Issue Tracker
            </a>
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm px-3 py-1.5 rounded border hover:bg-muted">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
