import { title } from "process"

export const Feature = ({ title, subtitle }: {
    title: string,
    subtitle: string
}) => {
    return <div className="flex pl-8">
        <Check />
        <div className="flex dlex-col justify-ceneter">
            <div className="flex">
                <div className="font-bold text-sm">{title}</div>
                <div className="text-sm pl-1">{subtitle}</div>
            </div>
        </div>
    </div>
}

function Check() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>

}