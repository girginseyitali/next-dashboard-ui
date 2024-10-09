"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { createClass, updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";

const schema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
  });

  type Inputs = z.infer<typeof schema>;

const ClassForm = ({type,data,setOpen,relatedData}:{
        type:"create" | "update"; data?:any;setOpen:Dispatch<SetStateAction<boolean>>; 
        relatedData?:any;}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
      });


      const [state, formAction] = useFormState(type ==="create" ? createClass : updateClass, {success:false, error:false});

      const onSubmit = handleSubmit(data=>{
        console.log(data);
        formAction(data);
      })


      const router = useRouter();

      useEffect(() =>{
        if (state.success) {
            toast(`Subject has been ${type==="create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
      },[state]);

      const {teachers, grades} = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : "Update the class"}</h1>
        
        <div className="flex justify-between flex-wrap gap-4">
            <InputField label="Class Name" name="name" defaultValue={data?.username} register={register} error={errors.name}/>
            <InputField label="Capacity" name="name" defaultValue={data?.username} register={register} error={errors.name}/>
            {data && 
              (<InputField label="Id" name="id" defaultValue={data?.name} register={register} error={errors?.name} hidden/>)}
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Supervisor</label>
                <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("supervisorId")} defaultValue={data?.teachers}>
                    {teachers.map((teacher:{id:string;name:string;surname:string}) => (
                      <option value={teacher.id} key={teacher.id} selected={data && teacher.id === data.supervisorId}>{teacher.name + " " + teacher.surname}</option>
                    ))}
                </select>
                {errors.supervisorId?.message && <p className="text-red-400 text-xs">{errors.supervisorId.message}</p>}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Grade</label>
                <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gradeId")} defaultValue={data?.gradeId}>
                    {grades.map((grade:{id:number;level:number}) => (
                      <option value={grade.id} key={grade.id} selected={data && grade.id === data.gradeId}>{grade.level}</option>
                    ))}
                </select>
                {errors.gradeId?.message && <p className="text-red-400 text-xs">{errors.gradeId.message}</p>}
            </div>
        </div>
        {state.error && <span className="text-sm text-red-500">Something went wrong!</span>}
        <button className="bg-blue-400 text-white p-2 rounded-md">{type==="create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default ClassForm