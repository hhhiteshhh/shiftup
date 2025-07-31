"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema, type USER_LOGIN_SCHEMA } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useTransition } from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
function LoginForm() {
  const { user } = useUser();

  const form = useForm<USER_LOGIN_SCHEMA>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const handleLogin = form.handleSubmit((data) => {
    startTransition(async () => {
      if (!isLoaded) return;
      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password,
        });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else {
          console.log(result); // handle other statuses if needed
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  useEffect(() => {
    if (!user) return;
    router.push("/dashboard");
  }, [user, router]);
  return (
    <Card className="w-full max-w-sm bg-shiftup-dark-gray border-0 py-10">
      <CardHeader className="space-y-5">
        <CardTitle className="text-center font-bold text-4xl text-shiftup-silver">
          SHIFT<span className="text-shiftup-red">UP</span>
        </CardTitle>
        <CardDescription className="text-center text-lg text-shiftup-silver">
          Internal Staff Portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleLogin} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white required">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="email"
                      className="w-full text-white"
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      autoFocus
                      aria-required="true"
                      aria-describedby="email-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white required">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      id="password"
                      className="w-full text-white"
                      type="password"
                      placeholder="password"
                      aria-required="true"
                      aria-describedby="password-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
