import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { addSubjects } from "@/redux/slices/subjects";

export default function Notes(props: any){
    const supabase = createClient()
    const [modalNote, setModalNote] = useState(false)
    const [showRenameNote, setShowRenameNote] = useState(false)

    const renameNoteRef = useRef<HTMLInputElement>(null)
    const noteModalRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    function deleteNote(){
        const confirm = true;
        if(confirm){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    supabase.from('Notes').delete().eq('id', props.id).then((res) => {
                        if(res.error){
                            console.log("Error ", res.error.message)
                        }
                        else {
                            alert('Note deleted successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('id', props.subjectid).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    dispatch(addSubjects(res.data as []))
                                    setModalNote(false)
                                }
                            })
                        }
                    })
                }
            });
        }
    }

    function renameNote(){
        const note = renameNoteRef.current?.value
        if(note){
            const token = localStorage.getItem('access_token') as string
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    supabase.from('Notes').update({name: note}).eq('id', props.id).then((res) => {
                        if(res.error){
                            console.log("Error ", res.error.message)
                        }
                        else {
                            alert('Note renamed successfully')
                            supabase.from('Subjects').select('*, Notes(*)').eq('id', props.subjectid).then((res) => {
                                if(res.error){
                                    console.log("Error ", res.error.message)
                                }
                                else {
                                    dispatch(addSubjects(res.data as []))
                                    setModalNote(false)
                                    setShowRenameNote(false)
                                }
                            })
                        }
                    })
                }
            });
        }
    }

    useEffect(() => {
        // close the note modal when clicked outside
        function handleClickOutside(event: any){
            if(noteModalRef.current && !noteModalRef.current.contains(event.target)){
                setModalNote(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showRenameNote])

    return (
        <>
            <div className="flex items-center justify-between relative">
                        <Link className="ml-3" href={"/app/notes/"+props.id}>{props.name}</Link>
                        <HiOutlineDotsHorizontal className="text-md font-semibold" onClick={() => setModalNote(!modalNote)} />
                            {modalNote && <div ref={noteModalRef} className="absolute top-8 right-0 bg-gray-900 shadow-md w-4/6 h-fit p-2 rounded flex flex-col">
                                <button className="text-white w-fit text-sm" onClick={() => setShowRenameNote(!showRenameNote)}>Rename</button>
                                <button className="text-white w-fit text-sm" onClick={() => deleteNote()}>Delete</button>
                            </div>}
            </div>
            {showRenameNote && <div className="fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-96 h-44 rounded-md flex flex-col justify-center items-center gap-2">
                <p className="text-lg font-semibold">Rename the note</p>
                    <input ref={renameNoteRef} type="text" placeholder="Enter a note name" className="w-80 h-10 border border-slate-600 rounded-md px-2" />
                    <div className="flex gap-2">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={() => renameNote()}>Create</button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setShowRenameNote(!showRenameNote)}>Cancel</button>
                    </div>
            </div>
                </div>}
        </>
    )
}