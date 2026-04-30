import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {

    return {
      title: `View Course `,
      description: ""
    }
  } catch (e) {
    return {
      title: "View Course",
      description: ""
    }
  }
}

function ViewCourse() {
  return (
    <div>ViewCourse</div>
  )
}

export default ViewCourse