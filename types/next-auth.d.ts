import NextAuth, {DefaultSession} from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            role?: string;
            username?: string | null;
            id?: string
        } & DefaultSession["user"];
    }

    interface User {
        role?: string
        username?: string
        id?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        username?: string | null;
        id?: string;
    }
}