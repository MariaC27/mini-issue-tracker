// ABOUTME: Clerk-hosted sign-up page using the SignUp component.
// ABOUTME: Mounted at /sign-up to match NEXT_PUBLIC_CLERK_SIGN_UP_URL.

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SignUp />
    </div>
  );
}
