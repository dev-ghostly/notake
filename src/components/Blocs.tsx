'use client'
import { IoAddOutline, IoAppsOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setError, setLoading, addNotes, changeBloc} from "@/redux/slices/note";
import { redirect } from "next/navigation";
import { Fa1, Fa2, Fa3, FaAlignCenter } from "react-icons/fa6";

interface BlocsProps {
    type: "h1"| "h2" | "h3" | "p"
    text: string
    noteid: string
    blocid: string
}

export default function Blocs(props: BlocsProps){
    const supabase = createClient();
    const dispatch = useDispatch();
    const [text, setText] = useState(props.text)
    const [changeTypeModal, setChangeTypeModal] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textAreaRef.current?.style.setProperty('height', 'auto');
        textAreaRef.current?.style.setProperty('height', `${textAreaRef.current?.scrollHeight +10}px`);
    }, [text])

    function createBloc(){
        supabase.auth.getUser(localStorage.getItem('access_token') as string).then((res) => {
            if(res.error){
                localStorage.removeItem('access_token')
                redirect('/login')
            }
            else {
                supabase.from('Blocs').insert([{type: 'p', text: 'Paragraphe', note: props.noteid}]).then((res) => {
                    if(res.error){
                        dispatch(setError(res.error.message))
                        console.log("Error ", res.error.message)
                    }
                    else {
                        supabase.from('Notes').select('*, Blocs(*)').eq('id', props.noteid).then((res) => {
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
        })
    };
    function changeBloc(e : React.ChangeEvent<HTMLTextAreaElement>){
        setText(e.target.value)
        supabase.auth.getUser(localStorage.getItem('access_token') as string).then((res) => {
            if(res.error){
                localStorage.removeItem('access_token')
                redirect('/login')
            }
            else {
                supabase.from('Blocs').update({text: e.target.value}).eq('id', props.blocid).then((res) => {
                    if(res.error){
                        dispatch(setError(res.error.message))
                        console.log("Error ", res.error.message)
                    }
                    textAreaRef.current?.style.setProperty('height', 'auto');
                    textAreaRef.current?.style.setProperty('height', `${textAreaRef.current?.scrollHeight + 10}px`);
                })
            }
        })
    };
    function deleteBloc(e : React.KeyboardEvent<HTMLTextAreaElement>){
        if (e.key === 'Backspace' && text === "") {
            supabase.auth.getUser(localStorage.getItem('access_token') as string).then((res) => {
                if(res.error){
                    localStorage.removeItem('access_token')
                    redirect('/login')
                }
                else {
                    supabase.from('Blocs').delete().eq('id', props.blocid).then((res) => {
                        if(res.error){
                            dispatch(setError(res.error.message))
                            console.log("Error ", res.error.message)
                        }
                        else {
                            supabase.from('Notes').select('*, Blocs(*)').eq('id', props.noteid).then((res) => {
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
            })
        
        }
    }
    function changeType(type: string){
        supabase.auth.getUser(localStorage.getItem('access_token') as string).then((res) => {
            if(res.error){
                localStorage.removeItem('access_token')
                redirect('/login')
            }
            else {
                supabase.from('Blocs').update({type: type}).eq('id', props.blocid).then((res) => {
                    if(res.error){
                        dispatch(setError(res.error.message))
                        console.log("Error ", res.error.message)
                    }
                    else {
                        supabase.from('Notes').select('*, Blocs(*)').eq('id', props.noteid).then((res) => {
                            if(res.error){
                                dispatch(setError(res.error.message))
                                console.log("Error ", res.error.message)
                            }
                            else {
                                dispatch(addNotes(res.data[0].Blocs))
                                setChangeTypeModal(false)
                            }
                        })
                    }
                })
            }
        })
    }
    switch (props.type) {
        case "h1":
            return (
                <div className="flex mx-auto w-3/5 relative">
                    <div className="flex flex-col gap-2 pt-0.5">
                        <IoAddOutline className="text-sm" onClick={(e) => createBloc()} />
                        <IoAppsOutline className="text-sm" onClick={(e) => setChangeTypeModal(!changeTypeModal)}/>
                    </div>
                    <textarea rows={1} ref={textAreaRef} onKeyDown={(e) => deleteBloc(e)} onChange={(e) => changeBloc(e)} value={text} className="resize-none ml-2 w-full p-1 text-2xl focus:outline-none" />
                    {changeTypeModal && <div className="absolute -left-44 top-10 w-40 h-fit bg-slate-100">
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h1")}><Fa1 fontSize={14}/>Title 1</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h2")}><Fa2 fontSize={14}/>Title 2</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h3")}><Fa3 fontSize={14}/>Title 3</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("p")}><FaAlignCenter fontSize={14}/>Paragraph</button>
                    </div>}
                </div>
            )
        case "h2":
            return (
                <div className="flex mx-auto w-3/5 relative">
                    <div className="flex flex-col gap-2 pt-0.5">
                        <IoAddOutline className="text-sm"  onClick={(e) => createBloc()}/>
                        <IoAppsOutline className="text-sm" onClick={(e) => setChangeTypeModal(!changeTypeModal)}/>
                    </div>
                    <textarea rows={1} ref={textAreaRef} onKeyDown={(e) => deleteBloc(e)} onChange={(e) => changeBloc(e)} value={text} className="resize-none ml-2 w-full p-1 text-xl focus:outline-none" />
                    {changeTypeModal && <div className="absolute -left-44 top-10 w-40 h-fit bg-slate-100">
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h1")}><Fa1 fontSize={14}/>Title 1</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h2")}><Fa2 fontSize={14}/>Title 2</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h3")}><Fa3 fontSize={14}/>Title 3</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("p")}><FaAlignCenter fontSize={14}/>Paragraph</button>
                    </div>}
                </div>
            )
        case "h3":
            return (
                <div className="flex mx-auto w-3/5 relative">
                    <div className="flex flex-col gap-2 pt-0.5">
                        <IoAddOutline className="text-sm"  onClick={(e) => createBloc()}/>
                        <IoAppsOutline className="text-sm" onClick={(e) => setChangeTypeModal(!changeTypeModal)}/>
                    </div>
                    <textarea rows={1} ref={textAreaRef} onKeyDown={(e) => deleteBloc(e)} onChange={(e) => changeBloc(e)} value={text} className="resize-none ml-2 w-full p-1 text-lg focus:outline-none" />
                    {changeTypeModal && <div className="absolute -left-44 top-10 w-40 h-fit bg-slate-100">
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h1")}><Fa1 fontSize={14}/>Title 1</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h2")}><Fa2 fontSize={14}/>Title 2</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h3")}><Fa3 fontSize={14}/>Title 3</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("p")}><FaAlignCenter fontSize={14}/>Paragraph</button>
                    </div>}
                </div>
            )
        case "p":
            return (
                <div className="flex mx-auto w-3/5 relative">
                    <div className="flex flex-col gap-2 pt-0.5">
                        <IoAddOutline className="text-sm"  onClick={(e) => createBloc()}/>
                        <IoAppsOutline className="text-sm" onClick={(e) => setChangeTypeModal(!changeTypeModal)} />
                    </div>
                    <textarea rows={1} ref={textAreaRef} onKeyDown={(e) => deleteBloc(e)} onChange={(e) => changeBloc(e)} value={text} className="resize-none ml-2 w-full p-1 text-md focus:outline-none" />
                    {changeTypeModal && <div className="absolute -left-44 top-10 w-40 h-fit bg-slate-100">
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h1")}><Fa1 fontSize={14}/>Title 1</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h2")}><Fa2 fontSize={14}/>Title 2</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h3")}><Fa3 fontSize={14}/>Title 3</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("p")}><FaAlignCenter fontSize={14}/>Paragraph</button>
                    </div>}
                </div>
            )
        default:
            return (
                <div className="flex mx-auto w-3/5 relative">
                    <div className="flex flex-col gap-2 pt-0.5">
                        <IoAddOutline className="text-sm"  onClick={(e) => createBloc()}/>
                        <IoAppsOutline className="text-sm" onClick={(e) => setChangeTypeModal(!changeTypeModal)}/>
                    </div>
                    <textarea rows={1} ref={textAreaRef} onKeyDown={(e) => deleteBloc(e)} onChange={(e) => changeBloc(e)} value={text} className="resize-none ml-2 w-full p-1 text-md focus:outline-none" />
                    {changeTypeModal && <div className="absolute -left-44 top-10 w-40 h-fit bg-slate-100">
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h1")}><Fa1 fontSize={14}/>Title 1</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h2")}><Fa2 fontSize={14}/>Title 2</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("h3")}><Fa3 fontSize={14}/>Title 3</button>
                        <button className="w-full py-2 px-3 flex items-center border-b gap-2" onClick={(e) => changeType("p")}><FaAlignCenter fontSize={14}/>Paragraph</button>
                    </div>}
                </div>
            )
    }
}