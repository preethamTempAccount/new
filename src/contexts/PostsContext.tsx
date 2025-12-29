import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Post, Comment } from '../types';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'upvotes' | 'upvotedBy' | 'comments' | 'createdAt'>) => void;
  upvotePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getUserPosts: (userId: string) => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Broken streetlight on Main Street causing safety concerns. This has been an issue for over 2 weeks now.',
    imageUrl: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['safety', 'infrastructure'],
    category: 'Public Safety',
    location: 'Main Street, Downtown',
    upvotes: 24,
    upvotedBy: ['1'],
    comments: [
      {
        id: 'c1',
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'I noticed this too! Very dangerous at night.',
        createdAt: new Date(Date.now() - 86400000)
      }
    ],
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Pothole on Oak Avenue needs immediate attention. Multiple vehicles have been damaged.',
    imageUrl: 'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['road', 'maintenance'],
    category: 'Infrastructure',
    location: 'Oak Avenue',
    upvotes: 18,
    upvotedBy: ['2'],
    comments: [],
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    id: '3',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Park playground equipment is rusty and unsafe for children.',
    imageUrl: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['park', 'children', 'safety'],
    category: 'Public Facilities',
    location: 'Central Park',
    upvotes: 31,
    upvotedBy: ['1', '2'],
    comments: [
      {
        id: 'c2',
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'This is concerning. Hope it gets fixed soon.',
        createdAt: new Date(Date.now() - 43200000)
      }
    ],
    createdAt: new Date(Date.now() - 345600000)
  }
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    // BACKEND API INTEGRATION POINT
    // GET /api/posts
    // Response: { posts: Post[] }
    // This would fetch posts from the backend on mount
  }, []);

  const addPost = (postData: Omit<Post, 'id' | 'upvotes' | 'upvotedBy' | 'comments' | 'createdAt'>) => {
    // BACKEND API INTEGRATION POINT
    // POST /api/posts
    // Body: postData
    // Response: { post: Post }

    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      upvotes: 0,
      upvotedBy: [],
      comments: [],
      createdAt: new Date()
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const upvotePost = (postId: string, userId: string) => {
    // BACKEND API INTEGRATION POINT
    // POST /api/posts/:id/upvote
    // Body: { userId }
    // Response: { post: Post }

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const hasUpvoted = post.upvotedBy.includes(userId);
          return {
            ...post,
            upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            upvotedBy: hasUpvoted
              ? post.upvotedBy.filter(id => id !== userId)
              : [...post.upvotedBy, userId]
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    // BACKEND API INTEGRATION POINT
    // POST /api/posts/:id/comment
    // Body: commentData
    // Response: { comment: Comment }

    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const getUserPosts = (userId: string) => {
    // BACKEND API INTEGRATION POINT
    // GET /api/users/:id/posts
    // Response: { posts: Post[] }

    return posts
      .filter(post => post.userId === userId)
      .sort((a, b) => b.upvotes - a.upvotes);
  };

  const sortedPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <PostsContext.Provider value={{
      posts: sortedPosts,
      addPost,
      upvotePost,
      addComment,
      getUserPosts
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
