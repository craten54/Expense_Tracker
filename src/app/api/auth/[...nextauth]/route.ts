import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import yang sudah di-export tadi

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };