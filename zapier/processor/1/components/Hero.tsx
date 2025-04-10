"use client"
import { PrimaryButton } from "./button/PrimaryButton"
import { SecondaryButton } from "./button/SecondaryButton"
import { Feature } from "./Feature"

export const Hero = () => {
    return <div>

        <div className="flex justify-center">
            <div className="text-5xl font-semibold text-center pt-8 max-w-xl">

                Automate as fast as you can type

            </div>
        </div>
        <div className="flex justify-center pt-2">
            <div className="text-xl font-normal text-center pt-8 max-w-2xl">

                AI give you automation superpower, and Zapier puts them to work. Pairing AI and Zapier helps you turn ideas into workflows and bots that work for you.

            </div>
        </div>
        <div className=" flex justify-center pt-4">
            <div className="flex pt-4">
                <PrimaryButton onClick={() => { console.log("hii") }} size="big">Get Started</PrimaryButton>
                <div className="pl-4">
                    <SecondaryButton onClick={() => { console.log("hii") }} size="big">Learn More</SecondaryButton>
                </div>
            </div>
        </div>
        <div className="flex justify-center">
            <Feature title={"Free Forever"} subtitle={"for core feature"}/>
            <Feature title={"Free Forever"} subtitle={"for core feature"}/>
            <Feature title={"Free Forever"} subtitle={"for core feature"}/>
        </div>
    </div>
}