"use server";

import { db } from "@/server";
import { posts } from "../schema";
import { revalidatePath } from "next/cache";

const createPost = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  if (!title) {
    return {
      error: "Title is required",
    };
  }
  revalidatePath("/");
  const data = await db.insert(posts).values({
    title,
  });
  return { success: data };
};
export default createPost;
