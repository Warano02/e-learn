"use client"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ICourse } from "./course-card"

function EditCourse({ children, course, setActual }: { course: ICourse, children: React.ReactNode, setActual: (c: ICourse) => void }) {
    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState({ description: "", title: "" })
    const createModule = async () => {
        try {
            setLoading(true)
        } catch (e) {
            console.log("Error occured while trying to create chapter ", e)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Drawer direction="left">
            <DrawerTrigger >
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Chapter</DrawerTitle>
                    <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <form className={cn("grid items-start gap-6 px-2")} onSubmit={(e) => { e.preventDefault(); createModule() }}>
                    <div className="grid gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))} id="title" defaultValue="" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Input onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))} id="description" defaultValue="" />
                    </div>
                    <DrawerFooter>
                        <Button disabled={loading} type="submit">
                            {loading ? <>Creating...<span className='size-3 border-1 banimated-spin' /> </> : "Create"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

export default EditCourse