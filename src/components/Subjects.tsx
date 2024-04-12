'use client'
import { useState, useRef, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import {useDispatch, useSelector} from 'react-redux'
import { addSubjects } from "@/redux/slices/subjects"
import Link from "next/link"
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation'
import Notes from "./Notes"

export default function Subjects({name, id, notes} : {name: string, id: string, notes: []}){
    const [open, setOpen] = useState(false)
    const [modalSubject, setModalSubject] = useState(false)
    const [showCreateNote, setShowCreateNote] = useState(false)
    const [showRenameSubject, setShowRenameSubject] = useState(false)

    const dispatch = useDispatch()
    const supabase = createClient();
    const router = useRouter()

    const createNoteRef = useRef<HTMLInputElement>(null)
    const renameSubjectRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    function createNote(){
        const note = createNoteRef.current?.value
        if(note){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    supabase.from('Notes').insert({name: note, subject : id}).then((res) => {
                        console.log(res)
                        if (res.status === 201) {
                            alert('Note created successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('id', id).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    setShowCreateNote(false)
                                    dispatch(addSubjects(res.data as []))
                                }
                            })
                        }
                    })
                }
            });
        }
    }

    function deleteSubject(){
        const confirm = true;
        if(confirm){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    const userid = res.data.user.id
                    supabase.from('Subjects').delete().eq('id', id).then((res) => {
                        if(res.error){
                            console.log("Error ", res.error.message)
                        }
                        else {
                            alert('Subject deleted successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('user_id', userid).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    dispatch(addSubjects(res.data as []))
                                    setModalSubject(false)
                                    router.push('/app')
                                }
                            })
                        }
                    })
                }
            });
        }
    }

    function renameSubject(){
        const subject = renameSubjectRef.current?.value
        if(subject){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    const userid = res.data.user.id
                    supabase.from('Subjects').update({name: subject}).eq('id', id).then((res) => {
                        if(res.error){
                            console.log("Error ", res.error.message)
                        }
                        else {
                            alert('Subject renamed successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('user_id', userid).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    dispatch(addSubjects(res.data as []))
                                    setModalSubject(false)
                                    setShowRenameSubject(false)
                                }
                            })
                        }
                    })
                }
            });
        }
    }

    useEffect(() => {
        // when clicked outside the modalSubject, close the modal
        function handleClickOutside(event: any){
            if(modalRef.current && !modalRef.current.contains(event.target)){
                setModalSubject(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [])

    return <div>
        <div className="flex items-center justify-between py-0.5 px-2 mx-2 cursor-pointer rounded hover:bg-slate-200 relative">
            <h1 className="font-semibold w-4/6" onClick={() => setOpen(!open)}>{name}</h1>
            <div className="flex items-center gap-2">
                <IoAddOutline className="text-md font-semibold" onClick={() => setShowCreateNote(!showCreateNote)} />
                <HiOutlineDotsHorizontal className="text-md font-semibold" onClick={() => setModalSubject(!modalSubject)} />
            </div>
            {modalSubject && <div  ref={modalRef} className="absolute top-8 right-0 bg-gray-900 shadow-md w-4/6 h-fit p-2 rounded flex flex-col">
                    <button className="text-white w-fit text-sm" onClick={() => setShowRenameSubject(!showRenameSubject)}>Rename</button>
                    <button className="text-white w-fit text-sm" onClick={() => deleteSubject()}>Delete</button>
                </div>}
        </div>
        {open && <div className="mx-4 text-sm flex flex-col mt-0.5">
            {notes.map((note : any) => (
                <Notes key={note.id} name={note.name} id={note.id} subjectid={id} />
            ))}
        </div>}
        {showCreateNote && <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-96 h-44 rounded-md flex flex-col justify-center items-center gap-2">
                <p className="text-lg font-semibold">Create a new note</p>
                <input ref={createNoteRef} type="text" placeholder="Enter the subject name" className="w-80 h-10 border border-slate-600 rounded-md px-2" />
                <div className="flex gap-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={() => createNote()}>Create</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setShowCreateNote(!showCreateNote)}>Cancel</button>
                </div>
            </div>
        </div>}
        {showRenameSubject && <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-96 h-44 rounded-md flex flex-col justify-center items-center gap-2">
                <p className="text-lg font-semibold">Rename the subject</p>
                <input ref={renameSubjectRef} type="text" placeholder="Enter the new subject name" className="w-80 h-10 border border-slate-600 rounded-md px-2" />
                <div className="flex gap-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={() => renameSubject()}>Rename</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setShowRenameSubject(!showRenameSubject)}>Cancel</button>
                </div>
            </div>
        </div>}
    </div>
}