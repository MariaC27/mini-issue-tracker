// ABOUTME: Clerk-hosted sign-in page using the SignIn component.
// ABOUTME: Mounted at /sign-in to match NEXT_PUBLIC_CLERK_SIGN_IN_URL.

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SignIn />
    </div>
  );
}
