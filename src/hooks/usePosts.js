/**
 * hooks/usePosts.js
 * CRUD de publicaciones — payloads ahora son objetos JSON, no FormData.
 */

import { useState, useEffect, useCallback } from 'react';
import { postsService } from '@/services/api';

export const usePosts = (filters = {}) => {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postsService.getAll(filters);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  /** @param {{ title, body, category, status }} payload */
  const create = async (payload) => {
    const newPost = await postsService.create(payload);
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  /** @param {number} id  @param {object} payload */
  const update = async (id, payload) => {
    const updated = await postsService.update(id, payload);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id) => {
    await postsService.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return { posts, loading, error, create, update, remove, refetch: fetchPosts };
};
