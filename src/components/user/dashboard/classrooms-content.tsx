"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/lib/axios"
import { Home, House } from "lucide-react"
import { useEffect, useState } from "react"
import ClassRoomCard, { IClassroomCard } from "./classroom-card"

function ClassroomsContent() {
    const mockRoom: IClassroomCard = {
        _id: "22",
        name: "L3 INFO",
        description: "Welcome to L3 In",
        favicon: "",
        status: "pending",
        joinCode: ""
    }
    const [loading, setLoading] = useState(true)
    const [classrooms, setCR] = useState<IClassroomCard[]>([])
    const fetchClass = async () => {
        try {
            const { data } = await axiosInstance.get<{ classrooms: IClassroomCard[] }>("/cr")
            setCR(data.classrooms)
        } catch (e) {
            console.log(e)
            alert("Error occured while fectching classrooms ")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClass()
    }, [])
    if (loading) return <p>Loading...</p>
    if (classrooms.length == 0) return <NoClassRooms />

    return (
        <div className="flex-1 w-full overflow-auto">
            <div className="p-4 md:p-6 space-y-6">

                <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                    <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Home className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Your Classrooms</h2>
                        <p className="text-sm text-muted-foreground">
                            Click on one of it to preview content, show assigment and more...
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        classrooms.map(classroom => <ClassRoomCard room={classroom} key={classroom._id} />)
                    }
                </div>
            </div>
        </div>
    )
}




const NoClassRooms = () => {
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")

    const requestJoin = async () => {
        try {
            setLoading(true)
            const { data } = await axiosInstance.post("/cr/join?joinCode=" + code.toUpperCase())
            alert(data.message)
            setCode("")
        } catch (e: any) {

            alert(e?.response?.data?.message || "Error occurd while trying to request join")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <House className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Classroom Join yet </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                You haven't join some virtual calssroom for now. Enter the code and join here
            </p>

            <form onSubmit={(e) => { e.preventDefault(); requestJoin() }} className="flex gap-4 mt-12">
                <Input value={code} placeholder="Enter the code " onChange={e => setCode(e.target.value)} required />
                <Button disabled={loading || !code || code.length !== 9} type="submit" variant={"secondary"} className="cursor-pointer disabled:cursor-not-allowed">
                    {loading ? <><span className="size-4 border-2 border-primary rounded-full animation-spin" /> Joining...  </> : "Request to join"}
                </Button>
            </form>
        </div>
    )
}


export default ClassroomsContent