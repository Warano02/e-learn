import { BookmarksHeader } from "@/components/user/dashboard/header";
import { TrashContent } from "@/components/user/dashboard/trash-content";

export default function TrashPage() {
  return (
    <>
      <BookmarksHeader title="Trash" />
      <TrashContent />
    </>
  );
}

