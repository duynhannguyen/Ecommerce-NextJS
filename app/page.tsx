import PostButton from "@/components/post-button";
import { Button } from "@/components/ui/button";
import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-post";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Home() {
  const { error, success } = await getPosts();

  if (error) {
    throw new Error(error);
  }

  if (success) {
    return (
      <main>
        {success.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
          </div>
        ))}
        <form action={createPost}>
          <input
            className="bg-black"
            type="text"
            name="title"
            placeholder="Title"
          />
          <PostButton />
          <Button> Click me </Button>
        </form>
        <div> {Date.now()}</div>
      </main>
    );
  }
}
