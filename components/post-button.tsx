"use client";

import { useFormStatus } from "react-dom";

const PostButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-blue-500 p-2 rounded disabled:opacity-65 "
      type="submit"
      disabled={pending}
    >
      {" "}
      Submit
    </button>
  );
};
export default PostButton;
