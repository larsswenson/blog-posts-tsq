import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const queryClient = new QueryClient();
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type NewPost = {
  title: string;
  body: string;
  userId: number;
};

const fetchPosts = async (filterUserId: string): Promise<Post[]> => {
  const response = await axios.get(API_URL, {
    params: filterUserId ? { userId: filterUserId } : {},
  });
  console.log('Fetched posts:', response.data);
  return response.data;
};

const createPost = async (newPost: NewPost): Promise<Post> => {
  const response = await axios.post(API_URL, newPost);
  console.log('Created post:', response.data);
  return response.data;
};

const updatePost = async (updatedPost: Post): Promise<Post> => {
  const response = await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost);
  console.log('Updated post:', response.data);
  return response.data;
};

const patchPostTitle = async (id: number, title: string): Promise<Post> => {
  const response = await axios.patch(`${API_URL}/${id}`, { title });
  console.log('Patched post title:', response.data);
  return response.data;
};

const deletePost = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
  console.log('Deleted post ID:', id);
};

const App = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [patchingPost, setPatchingPost] = useState<Post | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  const { data, error, isPending, refetch } = useQuery<Post[], Error>({
    queryKey: ['posts', filterUserId],
    queryFn: () => fetchPosts(filterUserId),
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      setLocalPosts(data);
    }
  }, [data]);

  const createMutation = useMutation<Post, Error, NewPost>({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: (newPost) => {
      console.log('Post created successfully');
      setLocalPosts((prevPosts) => [...prevPosts, newPost]);
      setTitle('');
      setBody('');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });

  const updateMutation = useMutation<Post, Error, Post>({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost),
    onSuccess: (updatedPost) => {
      console.log('Post updated successfully');
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      ); 
      setEditingPost(null);
      setTitle('');
      setBody('');
    },
    onError: (error) => {
      console.error('Error updating post:', error);
    },
  });

  const patchMutation = useMutation<Post, Error, { id: number; title: string }>({
    mutationFn: ({ id, title }) => patchPostTitle(id, title),
    onSuccess: (updatedPost) => {
      console.log('Post title patched successfully');
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      ); 
      setPatchingPost(null);
      setNewTitle('');
    },
    onError: (error) => {
      console.error('Error patching post title:', error);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, id) => {
      console.log('Post deleted successfully');
      setLocalPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); 
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
  });

  const handleSubmit = () => {
    if (editingPost) {
      console.log('Updating post:', { ...editingPost, title, body });
      updateMutation.mutate({ ...editingPost, title, body });
    } else {
      console.log('Creating post:', { title, body, userId: 1 });
      createMutation.mutate({ title, body, userId: 1 });
    }
  };

  const handlePatchTitle = () => {
    if (patchingPost) {
      console.log('Patching post title:', { id: patchingPost.id, title: newTitle });
      patchMutation.mutate({ id: patchingPost.id, title: newTitle });
    }
  };

  const handleDelete = (id: number) => {
    console.log('Deleting post ID:', id);
    deleteMutation.mutate(id);
  };

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filter by User ID"
        value={filterUserId}
        onChangeText={(text) => {
          setFilterUserId(text);
          refetch();
        }}
      />
      <FlatList
        data={localPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.title}>{item.title}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setEditingPost(item);
                setTitle(item.title);
                setBody(item.body);
              }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setPatchingPost(item);
                setNewTitle(item.title);
              }}
            >
              <Text style={styles.buttonText}>Update Title</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Body"
        value={body}
        onChangeText={setBody}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingPost ? 'Update Post' : 'Create Post'}</Text>
      </Pressable>
      {editingPost && (
        <Pressable
          style={styles.button}
          onPress={() => {
            setEditingPost(null);
            setTitle('');
            setBody('');
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      )}
      {patchingPost && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="New Title"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <Pressable style={styles.button} onPress={handlePatchTitle}>
            <Text style={styles.buttonText}>Submit Title Update</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setPatchingPost(null);
              setNewTitle('');
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  post: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}













