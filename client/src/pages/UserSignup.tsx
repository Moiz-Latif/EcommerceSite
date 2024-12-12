import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import googleicon from "../assets/google.png";
import axios from "axios";

const signupSchema = z.object({
  username: z.string().min(6, { message: "Username must be atleast 6 characters long" }).max(35, { message: "Username should be 35 characters long at max" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmpassword: z.string(),
}).refine((data) => data.password === data.confirmpassword, {
  message: "Passwords don't match",
  path: ["confirmpassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface UserSignupProps {
  toggleForm: () => void;
}

export function UserSignup({ toggleForm }: UserSignupProps) {
  const [isHidden, setIsHidden] = useState(true);
  const [Hidden, setHidden] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleTogglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const targetInputName = e.currentTarget.getAttribute("data-name");

    targetInputName === "password" ? setIsHidden(!isHidden) : setHidden(!Hidden);
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await axios.post('http://localhost:3000/Signup', data);
      if (response) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };


  return (
    <>
      <p className="text-base mb-6 text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="text-black font-semibold hover:underline"
        >
          Log In
        </button>
      </p>
      <form className="space-y-4 font-roboto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="relative">
          <input
            {...register("password")}
            type={isHidden ? "password" : "text"}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <button
            onClick={handleTogglePasswordVisibility}
            className="absolute right-3 top-2.5 text-gray-500"
            aria-label={isHidden ? "Show password" : "Hide password"}
            data-name="password"
          >
            {isHidden ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        <div className="relative">
          <input
            {...register("confirmpassword")}
            type={Hidden ? "password" : "text"}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <button
            onClick={handleTogglePasswordVisibility}
            className="absolute right-3 top-2.5 text-gray-500"
            aria-label={Hidden ? "Show password" : "Hide password"}
            data-name="confirmpassword"
          >
            {Hidden ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmpassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmpassword.message}</p>
        )}
        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          type="submit"
        >
          Sign Up
        </button>

      </form>
      <div className="grid grid-cols-3 items-center mt-4">
        <div className="w-full h-[1px] bg-gray-400"></div>
        <h1 className="text-center text-gray-400">Or</h1>
        <div className="w-full h-[1px] bg-gray-400"></div>
      </div>
      <button
        type="button"
        onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
        className="w-full bg-white text-black py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-300 mt-3"
      >
        <div className="flex gap-2 justify-center items-center">
          <img src={googleicon} className="w-7" alt="Google icon" />
          <h1>Sign in with Google</h1>
        </div>

      </button>
    </>
  );
}