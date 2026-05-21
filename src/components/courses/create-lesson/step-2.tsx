import { RichTextEditor } from "@/components/rich-text-editor"
import { useCreateLesson } from "@/store/lesson.store"

function Step2() {
    const { data, updateData } = useCreateLesson()
    return (
        <div className="flex-1 overflow-auto p-4">
            <div className="border-b px-6 py-2 mb-1">
                <h1 className="text-base font-semibold ">Type content of your course</h1>
            </div>
            <RichTextEditor
                value={data.content}
                onChange={(v) => updateData({ content: v })}
                placeholder="Type your course content..."
                minHeight="min-h-95"
            />
        </div>
    )
}

export default Step2