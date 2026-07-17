"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { Camera, User } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const page = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.get(`${backendUrl}/profile`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryKey: ["profile detail"],
    queryFn: fetchApi,
  });
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg shadow-teal-900/5 ring-1 ring-slate-100 border-2 border-gray-200">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update your personal information.
          </p>
        </div>

        <form className="space-y-6 ">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                <User className="h-7 w-7" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm transition hover:bg-teal-700 cursor-pointer"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Profile photo
              </p>
              <p className="text-xs text-slate-400">JPG or PNG, up to 2MB.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <span className="text-xs text-slate-400"></span>
            </div>

            <textarea
              id="description"
              rows={5}
              placeholder="Tell us something about yourself (optional)"
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default page;
