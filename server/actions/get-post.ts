"use server";

import { db } from "@/server";

const getPosts = async () => {
  const posts = await db.query.posts.findMany();
  if (!posts) {
    return {
      error: "No posts found",
    };
  }
  return { success: posts };
};
export default getPosts;
