"use client"

import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function AuthLinks() {
    return (
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
            <LoginLink className={buttonVariants({ variant: "outline" })}>
                Login
            </LoginLink>
            <RegisterLink className={buttonVariants({ variant: "default" })}>
                Sign Up
            </RegisterLink>
        </div>
    );
}
