export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export type Tag = {
  _id: string;
  name: string;
  color: string;
  count: number;
};

export interface Bookmark  {
  _id: string;
  title: string;
  description: string;
  favicon: string;
  tags: TagS[];
  interests: TagS[];
  interests?: string[];
  createdAt: string;
  isFavorite: boolean;
  hasDarkIcon?: boolean;
};
