"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

function LoginPage() {
  // Show Password Selector
  const [showPassword, setShowPassword] = useState(false);
  // route
  const route = useRouter();
  // login ref
  const inEmailRef = useRef<HTMLInputElement>(null);
  const inPasswordRef = useRef<HTMLInputElement>(null);

  // route protection
  useEffect(() => {
    if (localStorage.getItem("token")) {
      route.replace("/dashboard");
    }
  }, []);

  // login system
  const onBtnSignIn = async () => {
    try {
      const email = inEmailRef.current?.value;
      const password = inPasswordRef.current?.value;

      if (!email || !password) {
        alert("Email Wajib Diisi");
        return;
      }
      const res = await apiCall.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.result.token;

      // set token to localstorage
      console.log(res.data.result.id);
      // localStorage.setItem("token", res.data.result.token);
      if (token) {
        useAuthStore.getState().login(token);
        route.replace("/");
        console.log(res.data.result);
      }

      toast.success(`Login Success!`, {
        autoClose: 1000,
      });
    } catch (error) {
      alert("There is something wrong");
      console.log(error);
    }
  };

  return (
    <section
      id="register-page"
      className="flex justify-center min-h-screen items-center "
    >
      <div className="w-[96vw]  lg:h-[96vh] max-sm:my-5 lg:flex shadow-2xl rounded-xl overflow-hidden  max-lg:p-3  ">
        <div className="relative lg:w-full lg:h-full w-full h-40 flex justify-center max-lg:rounded-xl overflow-hidden shadow-md">
          <div className="absolute inset-0 z-10 bg-black/35 " />
          <Image
            src="/registerlogin2.jpg"
            fill
            className="object-cover"
            alt="register-login"
          />

          {/* Logo and branding */}
          <div className="absolute z-20 flex flex-col items-center h-[100%] justify-center lg:p-8 text-center">
            <div className="lg:mb-6 lg:p-6">
              <Image
                src="/logo.svg"
                width={80}
                height={80}
                className="w-full max-sm:w-50"
                alt="logo"
              />
            </div>

            <p className="mt-3 text-sm  lg:max-w-md lg:text-lg text-white/90">
              Join thousands of users who trust us with their event ticketing
              needs
            </p>
          </div>
        </div>
        {/* Register Form */}
        <div
          id="register-form"
          className="lg:w-full lg:flex lg:items-center lg:justify-center xl:max-w-2xl lg:max-w-sm lg:bg-white    "
        >
          <form action="" className=" lg:p-5">
            <div
              id="card-header"
              className="text-center max-md:text-start my-4 "
            >
              <p className="text-2xl lg:text-4xl font-bold">Login Account</p>
              <p className="text-gray-400 max-sm:text-sm lg:mt-5 lg:text-xl">
                Register now and start your journey!
              </p>
            </div>

            <div className="py-4">
              <label className="text-xl">Email</label>
              <Input
                placeholder="Your Email"
                required
                type="email"
                className="mt-2 p-5 bg-white shadow-md shadow-blue-200"
                ref={inEmailRef}
              ></Input>
            </div>
            <div className="py-4 relative">
              <div className="flex justify-between items-center">
                <label className="text-xl">Password</label>
                <Link
                  href="/forget-password"
                  className="text-sm text-blue-500 hover:text-blue-400 "
                >
                  Forget password?
                </Link>
              </div>
              <Input
                placeholder="Your Password"
                required
                type={showPassword ? "text" : "password"}
                className="mt-2 p-5 bg-white shadow-md shadow-blue-200"
                ref={inPasswordRef}
              ></Input>
              <button
                className="absolute top-15 right-2"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-blue-400"></EyeOff>
                ) : (
                  <Eye className="text-blue-400"></Eye>
                )}
              </button>
            </div>

            <div className="mt-5">
              <Button
                type="button"
                className="w-full p-6 cursor-pointer hover:bg-orange-600 bg-orange-500  shadow-xl text-lg"
                onClick={onBtnSignIn}
              >
                Login Account
              </Button>
            </div>

            {/* Already Account */}
            <p className="mt-5 text-center max-sm:text-sm text-lg ">
              Not Registered Yet?
              <span className="text-blue-600 hover:text-blue-700">
                {" "}
                <Link href={"/register"}>Create Account</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
      {/* End of Register Form */}
    </section>
  );
}

export default LoginPage;
