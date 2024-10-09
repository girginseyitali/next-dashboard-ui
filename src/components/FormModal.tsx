"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
//import TeacherForm from "./forms/TeacherForm";
//import StudentForm from "./forms/StudentForm";
import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import { deleteClass, deleteSubject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject:deleteSubject,
  class:deleteClass,
  teacher:deleteSubject,
  student:deleteSubject,
  parent:deleteSubject,
  lesson:deleteSubject,
  exam:deleteSubject,
  result:deleteSubject,
  assignment:deleteSubject,
  attendance:deleteSubject,
  event:deleteSubject,
  announcement:deleteSubject,
}

//LAZY LOADING
const TeacherForm = dynamic(() => import("./forms/TeacherForm"));
const StudentForm = dynamic(() => import("./forms/StudentForm"));
const ParentForm = dynamic(() => import("./forms/ParentForm"));
const SubjectForm = dynamic(() => import("./forms/SubjectForm"));
const ClassForm = dynamic(() => import("./forms/ClassForm"));
const LessonForm = dynamic(() => import("./forms/LessonForm"));
const ExamForm = dynamic(() => import("./forms/ExamForm"));
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"));
const ResultForm = dynamic(() => import("./forms/ResultForm"));
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"));
const EventForm = dynamic(() => import("./forms/EventForm"));
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"));

const forms:{
  [key:string]:(setOpen:Dispatch<SetStateAction<boolean>>, type:"create" | "update", data?:any, relatedData?:any)=>JSX.Element;
}={
  teacher:(setOpen,type,data, relatedData)=> <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  student:(setOpen,type,data, relatedData)=> <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  parent:(setOpen,type,data, relatedData)=> <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  subject:(setOpen,type,data, relatedData)=> <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  class:(setOpen,type,data, relatedData)=> <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  lesson:(setOpen,type,data, relatedData)=> <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  exam:(setOpen,type,data, relatedData)=> <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  assignment:(setOpen,type,data, relatedData)=> <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  result:(setOpen,type,data, relatedData)=> <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  attendance:(setOpen,type,data, relatedData)=> <AttendanceForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  event:(setOpen,type,data, relatedData)=> <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  announcement:(setOpen,type,data, relatedData)=> <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
};

const FormModal = ({
    table,
    type,
    data,
    id,
    relatedData
}:FormContainerProps & {relatedData?:any}) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = type === "create" ? "bg-lamaYellow" : type==="update" ? "bg-lamaSky" : "bg-lamaPurple";
    const [open, setOpen] = useState(false);

    const Form = ()=>{

      const [state, formAction] = useFormState(deleteActionMap[table], {success:false, error:false});

      const router = useRouter();

      useEffect(() =>{
        if (state.success) {
            toast(`Subject has been deleted!`)
            setOpen(false);
            router.refresh();
        }
      },[state]);

      return type === "delete" && id ? (
        <form action={formAction} className="p-4 flex flex-col gap-4">
          <input type="text | number" name="id" value={id} hidden/>
          <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}?</span>
          <button className="bg-red-700 text-white py-2 rounded-md w-max self-center">Delete</button>
        </form>
      ) : type==="create" || type==="update" ? (
        forms[table](setOpen, type,data,relatedData)
      ) : "Form not found!";
    };

  return (
    <>
      <button 
      className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
      onClick={()=>setOpen(true)}
    >
        <Image src={`/${type}.png`} alt="" width={16} height={16}/>
    </button>
    {open && ( 
      <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
          <Form/>
          <div className="absolute top-4 right-4 cursor-pointer" onClick={()=>setOpen(false)}>
            <Image src="/close.png" alt="" width={14} height={14}/>
          </div>
        </div>
      </div> 
      )}
    </>
  )
}

export default FormModal