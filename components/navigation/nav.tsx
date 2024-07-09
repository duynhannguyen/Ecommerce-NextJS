import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
const Nav = async () => {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between ">
          <li>Logo</li>
          {!session ? (
            <li>
              <Button asChild className="flex gap-2">
                <Link href={"/auth/login"}>
                  {" "}
                  <LogIn size={16} /> <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton user={session?.user} expires={session.expires} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
