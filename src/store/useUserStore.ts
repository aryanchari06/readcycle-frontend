"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import { GQLQueries } from "@/graphql";
import client from "@/lib/apollo-client";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

interface UserState {
  user: IUser | null;
  setUser: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  setUser: async () => {
    const { user } = get();
    if (user) return;

    try {
      const { data } = await client.query({
        query: GQLQueries.GET_CURRENT_USER,
        fetchPolicy: "network-only", // Ensures fresh data is fetched
        context: { credentials: "include" }, // Send cookies for authentication
      });

      if (data?.getCurrentUser) set({ user: data.getCurrentUser });
    } catch (error) {
      console.log("Error while fetching user :", error);
      throw new Error("Could not fetch current user");
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null });
  },
}));

