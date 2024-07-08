import PostButton from "@/components/post-button";
import { Button } from "@/components/ui/button";
import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-post";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Home() {
  return <main>HomePage</main>;
}
