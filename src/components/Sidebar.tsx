'use client'
import Subjects from "./Subjects"
import { createClient } from "@/utils/supabase/client"
import {useEffect, useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSubjects } from "@/redux/slices/subjects"
import { useRouter } from 'next/navigation'
import { IoAddOutline } from "react-icons/io5";
import { TbDoorExit } from "react-icons/tb";
import ProfileMenu from "./ProfileMenu"


export default function Sidebar(){
    const supabase = createClient()
    const dispatch = useDispatch()
    const subjects = useSelector((state : any) => state.subjects.subjects)
    const router = useRouter()
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false)
    const createSubjectRef = useRef<HTMLInputElement>(null)
    const profileMenuRef = useRef<HTMLDivElement>(null)
    const [email , setEmail] = useState<string>('')
    useEffect(() => {
        // check the token if it is valid
        const token = localStorage.getItem('access_token')
        if(token){
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    router.push('/login')
                }
                else {
                    setEmail(res.data.user.email as string)            
                    supabase.from('Subjects').select('*, Notes(*)').eq('user_id', res.data.user.id).then((res) => {
                        if(res.error){
                            console.log("Error ", res.error.message)
                        }
                        else {
                            dispatch(addSubjects(res.data as []))
                        }
                    })
                }
            })
        }
        else{
            router.push('/login')
        }
    }, [])
    
    useEffect(() => {
        // close the profile modal when clicked outside
        function handleClickOutside(event: any){
            if(profileMenuRef.current && !profileMenuRef.current.contains(event.target)){
                setShowProfileModal(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileMenuRef])

    function createSubject(){
        const subject = createSubjectRef.current?.value
        if(subject){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    router.push('/login')
                }
                else {
                    const userid = res.data.user.id
                    supabase.from('Subjects').insert({name: subject, user_id : userid}).then((res) => {
                        if (res.status === 201) {
                            alert('Subject created successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('user_id', userid).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    setShowCreateSubjectModal(!showCreateSubjectModal)
                                    dispatch(addSubjects(res.data as []))
                                }
                            })
                        }
                    })
                }
            });
        }
    }
    function logout(){
        localStorage.removeItem('access_token')
        router.push('/login')
    }
    return <aside className="w-80 border-r border-r-slate-600 min-h-screen py-3 tracking-tight">
        <div className="flex w-full justify-center mb-1">
            <button className="text-center w-76 border w-64 py-2 mb-2 flex justify-center items-center gap-2 text-sm font-semibold rounded-md bg-indigo-600 text-white" onClick={(e) => setShowCreateSubjectModal(!showCreateSubjectModal)}>
                <IoAddOutline className="text-sm" />
                Create a new subject
            </button>
        </div>
        {subjects.map((subject : any) => (
            <Subjects key={subject.id} name={subject.name as string} id={subject.id} notes={subject.Notes}/>
        ))}
        <div onClick={() => setShowProfileModal(!showProfileModal)} className="w-80 flex px-2 py-2 absolute bottom-0 justify-between border-t border-t-slate-700">
            <div className="relative w-full">
                <div className="flex">
                    <div className="w-10 h-10 bg-slate-500 rounded-full mr-3"></div>
                    <div>
                        <p className="text-xs truncate w-5/6">{email}</p>
                        <p className="text-xs">Free account</p>
                    </div>
                </div>
                {showProfileModal && <div ref={profileMenuRef}><ProfileMenu profileModal={setShowProfileModal} /></div>}
            </div>
        </div>
        {showCreateSubjectModal && <div className="fixed top-0 left-0 z-10 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-96 h-44 rounded-md flex flex-col justify-center items-center gap-2">
                <p className="text-lg font-semibold">Create a new subject</p>
                <input ref={createSubjectRef} type="text" placeholder="Enter the subject name" className="w-80 h-10 border border-slate-600 rounded-md px-2" />
                <div className="flex gap-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={() => createSubject()}>Create</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setShowCreateSubjectModal(!showCreateSubjectModal)}>Cancel</button>
                </div>
            </div>
            </div>}
    </aside>
} 