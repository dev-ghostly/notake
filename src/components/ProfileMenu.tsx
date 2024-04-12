'use client'
import { TbDoorExit } from "react-icons/tb";
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from "react";

export default function ProfileMenu(props: any){
    const router = useRouter()
    function logout(){
        localStorage.removeItem('access_token')
        router.push('/login')
    }
    return (
        <div className="rounded absolute bottom-16 right-1.5 w-5/6 h-fit py-1 bg-gray-900">
                        <button className="text-white w-full flex justify-center items-center gap-2" onClick={() => logout()}>
                            <TbDoorExit className="text-md text-red-600" />
                            <p>Logout</p>
                        </button>
                    </div>
    )
}