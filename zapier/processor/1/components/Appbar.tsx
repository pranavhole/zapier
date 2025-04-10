"use client"
import { useRouter } from "next/navigation"
import { LinkButton } from "./button/LinkButton"
import { PrimaryButton } from "./button/PrimaryButton";

export const Appbar = ()=>{
const router = useRouter();

    return <div className="flex border-b justify-between p-4 ">
        <div className="dlex fexl-col justify-center text-2xl font-extrabold">
            Zapier
        </div>
        <div className="flex">
            <LinkButton onclick={()=>{}}>Contanct Sales</LinkButton>
            <LinkButton onclick={()=>{router.push("/login")}}>Login</LinkButton>
            <PrimaryButton onClick={()=>{router.push("/signup")}}>Signup</PrimaryButton>
        </div>
    </div> 
}