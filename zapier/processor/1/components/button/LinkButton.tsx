import { ReactNode } from "react";

export const LinkButton = ({children,onclick}:{children:ReactNode,  onclick:()=>void})=>{
    return <div className="px-4 py-2 cursor-pointer hover:bg-slate-100 font-light text-sm rounded" onClick={onclick}>
        {children}
    </div>
}