# React Expo Blog Posts App with TanStack Query

This is a simple blog posts app built using React, Expo, and TanStack Query for managing API requests. 
It allows fetching, creating, updating, deleting, and filtering fictional Ipsum Lorem blog posts.

## Features

- **Fetch Posts**: Retrieve all posts from the server.
- **Create Post**: Add a new post.
- **Update Post**: Edit an existing post.
- **Patch Post Title**: Update only the title of a post.
- **Delete Post**: Remove a post.
- **Filter Posts**: Filter posts by user ID.

## Technologies Used

- **React (Expo)**: A framework for building cross-platform mobile apps.
- **TanStack Query**: A powerful library for server-state management in React apps.
- **Axios**: A promise-based HTTP client for making API requests.
- **JSONPlaceholder**: A fake online REST API for testing and prototyping.

## Interact with the application:

Fetch Posts: Posts are auto fetched on loading app.
Filter by User ID: Enter a user ID in the input field to filter posts.
Create Post: Enter the title and body of a new post and click "Create Post".
Edit Post: Click the "Edit" button, modify title and body, and click "Update Post".
Patch Post Title: Click the "Update Title" button, modify the title, and click "Submit Title Update".
Delete Post: Click the "Delete" button on a post to remove it.

## App Component:

State Management: useState for form inputs and local state for posts.
Fetching Posts: useQuery from TanStack Query to fetch posts from JSONPlaceholder.
Creating, Updating, and Deleting Posts: useMutation from TanStack Query for creating, updating, and deleting.
Patching Post Title: useMutation from TanStack Query for patching title.
Local State: Maintains local copy of posts to reflect changes immediately.

## Key Functions:

fetchPosts: Fetch posts from API.
createPost: Create new post.
updatePost: Update an existing post.
patchPostTitle: Patch title of an existing post.
deletePost: Delete post.

## API Functions:

fetchPosts(filterUserId: string): Fetches posts, optionally filtering by user ID.
createPost(newPost: NewPost): Creates new post.
updatePost(updatedPost: Post): Updates existing post.
patchPostTitle(id: number, title: string): Updates title of an existing post.
deletePost(id: number): Deletes post by ID.

