import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import Logo from "./logo";
import CartDrawer from "../cart/cart-drawer";
const Nav = async () => {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4 ">
          <li className="flex flex-1">
            <Link href={"/"} title="logo" aria-label="sprout and scrible logo">
              <Logo />{" "}
            </Link>
          </li>
          <li className=" relative flex justify-center items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-items-center">
              <Button asChild className="flex gap-2">
                <Link href={"/auth/login"}>
                  {" "}
                  <LogIn size={16} /> <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-items-center">
              <UserButton user={session?.user} expires={session.expires} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
