"use client";
import { Input } from "@/components/ui/input";
import Dashboard from "../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "@/helper/updateProfile";
import { useForm } from "react-hook-form";
import { Update } from "next/dist/build/swc/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { toast } from "react-toastify";

function ProfileSettings() {
  // loading screen

  // zod update schema
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
  });

  const onBtnUpdate = async (formData: UpdateProfileSchema) => {
    try {
      const token = localStorage.getItem("token");
      const avatarInput = watch("avatar") as FileList;
      const avatarFile =
        avatarInput && avatarInput.length > 0 ? avatarInput[0] : null;

      const formDataToSend = new FormData();

      if (formData.first_name)
        formDataToSend.append("first_name", formData.first_name);
      if (formData.last_name)
        formDataToSend.append("last_name", formData.last_name);
      if (formData.email) formDataToSend.append("email", formData.email);
      if (formData.password)
        formDataToSend.append("password", formData.password);
      if (formData.phone_number)
        formDataToSend.append("phone_number", formData.phone_number);
      if (formData.organizer_name)
        formDataToSend.append("organizer_name", formData.organizer_name);

      if (avatarFile) formDataToSend.append("avatar", avatarFile);

      const res = await apiCall.patch("/user/profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // const data = res.data.result;
      // console.log(res);

      toast.success("Successfuly Update Data", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    first_name,
    last_name,
    email,
    organizer_name,
    phone_number,
    referral_code,
    isVerified,
    avatar,
    setUserProfile,
  } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await apiCall.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.result;
        const organizerName = data.organizer?.[0]?.organizer_name || "";

        setUserProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          referral_code: data.refferal_code,
          organizer_name: organizerName,
          isVerified: data.isVerified,
        });

        reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          organizer_name: organizerName,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [reset, setUserProfile]);

  return (
    <section>
      <Dashboard>
        <form
          className="flex flex-col gap-y-2 lg:w-[70%]"
          onSubmit={handleSubmit(onBtnUpdate)}
        >
          <div>
            <label htmlFor="first_name">First Name</label>
            <Input
              id="first_name"
              type="text"
              className="bg-white"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <Input
              id="last_name"
              type="text"
              className="bg-white"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="organizer_name">Organizer Name</label>
            <Input
              id="organizer_name"
              type="text"
              className="bg-white"
              {...register("organizer_name")}
            />
            {errors.organizer_name && (
              <p className="text-red-500 text-sm">
                {errors.organizer_name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              className="bg-white"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone_number">Phone Number</label>
            <Input
              type="text"
              id="phone_number"
              className="bg-white"
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">
                {errors.phone_number.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="avatar">Change Avatar</label>
            <Input
              id="avatar"
              type="file"
              {...register("avatar")}
              className="bg-white w-[30%]"
            />
            {errors.avatar?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.avatar.message)}
              </p>
            )}
          </div>
          <div>
            <label>Refferal Code</label>
            <Input
              className="bg-white"
              defaultValue={referral_code}
              disabled
            ></Input>
          </div>
          <div className="flex mt-10 gap-x-5">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer hover:scale-105  transition-all duration-300 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving Data" : "Save Data"}
            </Button>
          </div>
        </form>
      </Dashboard>
    </section>
  );
}
export default ProfileSettings;
