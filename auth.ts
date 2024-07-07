import NextAuth from "next-auth";

export const { handlers, signOut, signIn, auth } = NextAuth({
  providers: [],
});
