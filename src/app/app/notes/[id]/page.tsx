'use client'
import Blocs from "@/components/Blocs";
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setError, setLoading, addNotes} from "@/redux/slices/note";
import { IoAddOutline, IoAppsOutline } from "react-icons/io5";
export default function Page({params} : {params: {id: string}}) {
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.note.loading)
    const error = useSelector((state: any) => state.note.error)
    const blocs = useSelector((state: any) => state.note.blocs)

    const supabase = createClient();

    useEffect(() => {
        dispatch(setLoading())
        const token = localStorage.getItem('access_token')
        if(token){
            supabase.auth.getUser(token).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    window.location.href = '/login'
                }
                else {
                    supabase.from('Notes').select('*, Blocs(*)').eq('id', params.id).then((res) => {
                        if(res.error){
                            dispatch(setError(res.error.message))
                            console.log("Error ", res.error.message)
                        }
                        else {
                            if (res.data.length === 0) {
                                setError("Note not found")
                                return;
                            }
                            const Blocs = res.data[0].Blocs;
                            // sort by order
                            Blocs.sort((a: any, b: any) => a.order - b.order);

                            dispatch(addNotes(Blocs))
                        }
                    })
                }
            })
        }
        else{
            window.location.href = '/login'
        }
    }, [])

    function createBloc(){
        supabase.from('Blocs').insert([{type: 'p', text: 'Paragraphe', note: params.id}]).then((res) => {
            if(res.error){
                dispatch(setError(res.error.message))
                console.log("Error ", res.error.message)
            }
            else {
                supabase.from('Notes').select('*, Blocs(*)').eq('id', params.id).then((res) => {
                    if(res.error){
                        dispatch(setError(res.error.message))
                        console.log("Error ", res.error.message)
                    }
                    else {
                        dispatch(addNotes(res.data[0].Blocs))
                    }
                })
            }
        })
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    return (
        <div className="my-3 flex flex-col gap-1 p-3 w-9/12">
            {blocs.length === 0 && <div className="justify-center p-3 w-full flex items-center gap-6">Start creating your first content clicking on that button <button onClick={(e) => createBloc()} className="flex items-center bg-purple-800 text-white px-3 py-1 rounded gap-1"><IoAddOutline /> Create a bloc</button></div>}
            {blocs.map((bloc : any, id : string)=> (
                <Blocs key={id} blocid={bloc.id} type={bloc.type} text={bloc.text} noteid={params.id} />
            ))}
        </div>
    )
}