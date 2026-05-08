export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export interface Bookmark  {
  _id: string;
  title: string;
  description: string;
  favicon: string;
  tags: string[];
  interests?: string[];
  createdAt: string;
  isFavorite: boolean;
  hasDarkIcon?: boolean;
};
