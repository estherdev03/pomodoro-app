"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import FormError from "../ui/FormError";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required!"),
    lastName: z.string().min(1, "Last name is required!"),
    email: z.email("Invalid email address!"),
    password: z.string().min(6, "Password must be at least 6 characters!"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password do not match!",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setServerError("");
    try {
      const response = await registerUser(data);
      if (!response.token) {
        const error = await response.json();
        setServerError(error.message || "Failed to create account.");
      } else {
        //Navigate to the home dashboard
        router.push("/login");
        console.log("Create account successfully.", response);
      }
    } catch (error) {
      setServerError(
        "An error occur while creating your account. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      {serverError && <FormError message={serverError} />}
      <Input
        label="First Name"
        type="text"
        {...register("firstName")}
        error={errors.firstName?.message}
        name="firstName"
      />
      <Input
        label="Last Name"
        type="text"
        {...register("lastName")}
        error={errors.lastName?.message}
        name="lastName"
      />
      <Input
        label="Email"
        type="text"
        {...register("email")}
        error={errors.email?.message}
        name="email"
      />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        name="password"
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
        name="confirmPassword"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}
