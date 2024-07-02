import { cookies } from "next/headers";
import Image from "next/image";

export default async function Home() {
  cookies();
  return (
    <main>
      <div> {Date.now()}</div>
    </main>
  );
}
