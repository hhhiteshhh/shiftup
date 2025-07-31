import { z } from "zod";

export const userLoginSchema = z.object({
  email: z
    .string({ message: "This is a required field" })
    .email("This is not a valid email."),
  password: z
    .string({ message: "This is a required field" })
    .min(10, {
      message: "Password not valid",
    })
    .max(10, {
      message: "Password not valid",
    }),
});

export type USER_LOGIN_SCHEMA = z.infer<typeof userLoginSchema>;
