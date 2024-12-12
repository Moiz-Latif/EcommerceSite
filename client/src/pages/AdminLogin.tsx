'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const adminLoginSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
}).refine((data) => data.password === 'iamadmin', {
  message: "Incorrect Password",
  path: ['password']
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLogin() {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(true);
  const [Password , setPassword] = useState("");

  const { register, handleSubmit, formState: { errors }} = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const handleTogglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHidden(!isHidden);
  };

  const onSubmit = async (data: AdminLoginFormData) => {
    if(data.password === 'iamadmin'){
      navigate('/AdminDashboard');
    }

    const response = await axios.post('http://localhost:3000/AdminLogin',data,{
      withCredentials:true
    });
    //@ts-ignore
    const Getdata = response.data;
    if(Getdata){
      console.log('Recieved data successfully');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <input
          type={isHidden ? "password" : "text"}
          placeholder="Admin Password"
          {...register("password")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          value={Password}
          onChange={e => setPassword(e.target.value)}
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
      <div className="flex justify-between">
        {errors.password && <p className="text-red-500 text-sm inline-block">{errors.password.message}</p>}
        <button className="text-sm" type="button" onClick={()=>setPassword(prevPassword => prevPassword === '' ?'iamadmin' : '')}>Forgot password?</button>
      </div>

      <button
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}