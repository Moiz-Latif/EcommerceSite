import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import googleicon from '../assets/google.png';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface UserLoginProps {
  toggleForm: () => void;
}

export function UserLogin({ toggleForm }: UserLoginProps) {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleTogglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHidden(!isHidden);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:3000/UserLogin', data, {
        withCredentials: true
      });
      if (response) {
        reset();
        navigate('/UserDashboard');
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <p className="text-base mb-6 text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="text-black font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
      <form className="space-y-4 font-roboto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div className="relative">
          <input
            type={isHidden ? "password" : "text"}
            placeholder="Password"
            {...register("password")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <button
            onClick={handleTogglePasswordVisibility}
            className="absolute right-3 top-2.5 text-gray-500"
            aria-label={isHidden ? "Show password" : "Hide password"}
          >
            {isHidden ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          type="submit"
        >
          Login
        </button>
        <div className="grid grid-cols-3 items-center mt-4">
          <div className="w-full h-[1px] bg-gray-400"></div>
          <h1 className="text-center text-gray-400">Or</h1>
          <div className="w-full h-[1px] bg-gray-400"></div>
        </div>
        <button
          type="button"
          onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
          className="w-full bg-white text-black py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-300"
        >
          <div className="flex gap-2 justify-center items-center">
            <img src={googleicon} className="w-7" alt="Google icon" />
            <h1>Continue with Google</h1>
          </div>

        </button>
      </form>
    </>
  );
}