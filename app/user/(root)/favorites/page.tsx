import { BookmarksHeader } from "@/components/user/dashboard/header";
import { FavoritesContent } from "@/components/user/dashboard/favorites-content";

export default function FavoritesPage() {
  return (
    <>
      <BookmarksHeader title="Favorites" />
      <FavoritesContent />
    </>
  );
}

