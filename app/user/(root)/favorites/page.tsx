import { BookmarksHeader } from "@/components/user/dashboard/header";
import { FavoritesContent } from "@/components/user/dashboard/favorites-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorite Course - IW",
  description: "View courses that you have seen is more interesting for you "
}
export default function FavoritesPage() {
  return (
    <>
      <BookmarksHeader title="Favorites" />
      <FavoritesContent />
    </>
  );
}

