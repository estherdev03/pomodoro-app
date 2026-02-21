"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import FormError from "../ui/FormError";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const formSchema = z.object({
  email: z.email("Invalid email address!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { setLoggedIn } = useAuthStore();
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
      const response = await loginUser(data);
      if (!response.message) {
        const error = await response.json();
        setServerError(error.message || "Failed to create account.");
      } else if (response.twoFARequired) {
        router.push("/verify-2fa");
      } else {
        setLoggedIn(true);
        console.log("Login user successfully. ", response);
        //Navigate to the dashboard if logged in successfully
        router.push("/dashboard");
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
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {serverError && <FormError message={serverError} />}
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Login user..." : "Login"}
      </Button>
      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="grow border-t border-gray-300 "></div>
        <span className="px-2 text-gray-500 text-sm font-semibold">or</span>
        <div className="grow border-t border-gray-300"></div>
      </div>

      {/* Social login button */}
      <div className="flex flex-col space-y-2">
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
          <Button type="button" className="w-full bg-red-500 hover:bg-red-600">
            Login with Google
          </Button>
        </a>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}>
          <Button type="button" className="w-full bg-gray-800 hover:bg-red-900">
            Login with Github
          </Button>
        </a>
      </div>
    </form>
  );
}
