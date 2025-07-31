"use client";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
function Dashboard() {
  const { isLoaded, user } = useUser();
  const saveUser = useMutation(api.users.saveUser);

  const userSchema = z.object({
    clerkId: z.string(),
    email: z.string().email(),
    name: z.string(),
  });
  useEffect(() => {
    if (isLoaded && user && user.primaryEmailAddress) {
      const parsed = userSchema.parse({
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
      });

      saveUser(parsed).catch(console.error);
    }
  }, [isLoaded, user, saveUser]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <h1>Welcome, {user?.firstName || "User"}!</h1>
      <UserButton />
    </>
  );
}

export default Dashboard;
