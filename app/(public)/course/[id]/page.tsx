import CourseOverview from '@/components/user/courses/CourseOverview'
import { bookmarks } from '@/mock-data/bookmarks'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const { id } = await params
    const elem = bookmarks.find(b => b.id === id)

    return {
      title: `${elem?.title ? elem.title + " - " : " "}Course Overview`,
      description: ""
    }
  } catch (e) {
    return {
      title: "Course Overview",
      description: ""
    }
  }
}

function ViewCourse() {
  return (
    <CourseOverview/>
  )
}

export default ViewCourse