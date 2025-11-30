import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  communityService,
  type ICreatePostRequest,
} from "../services/community";
import type { IConnection, IPost } from "../utils/types";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";
// import { toast } from "sonner";

export const communityKeys = {
  all: ["community"] as const,
  posts: () => [...communityKeys.all, "posts"] as const,
  postsList: () => [...communityKeys.posts(), "list"] as const,
  postDetails: () => [...communityKeys.posts(), "detail"] as const,
  postDetail: (id: string) => [...communityKeys.postDetails(), id] as const,
  savedPosts: () => [...communityKeys.all, "saved"] as const,
  follows: () => [...communityKeys.all, "follows"] as const,
  connections: () => [...communityKeys.all, "connections"] as const,
};

export const useGetCommunityPosts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...communityKeys.postsList(), page, limit],
    queryFn: async () => {
      const response = await communityService.getPosts(page, limit);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải bài viết");
      }
      return response.payload.posts;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useGetSavedPosts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...communityKeys.savedPosts(), page, limit],
    queryFn: async () => {
      const response = await communityService.getSavedPosts(page, limit);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải bài viết đã lưu");
      }
      return response.payload.posts;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: false, // Chỉ fetch khi được gọi manually
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePostRequest) =>
      communityService.createPostWithMedia(data),
    onMutate: async (newPost) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());

      // Optimistically update
      queryClient.setQueryData(
        communityKeys.postsList(),
        (old: IPost[] = []) => {
          const optimisticPost: IPost = {
            ...newPost,
            id: "temp-id",
            reactions: {
              likes: 0,
              comments: 0,
              reposts: 0,
            },
            userReacted: false,
            author: {
              name: "",
              role: "user",
              avatar: "",
            },
            timestamp: new Date().toISOString(),
            userReposted: false,
            userSaved: false,
            post_type: (newPost as any).post_type ?? "",
            tags: (newPost as any).tags ?? [],
          };
          return [optimisticPost, ...old];
        }
      );
      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        communityKeys.postDetail(response.payload.post.id),
        response.payload.post
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
    },
  });
};

export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      reactionType,
    }: {
      postId: string;
      reactionType: string;
    }) => communityService.toggleReaction(postId, reactionType),
    onMutate: async ({ postId }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });
      await queryClient.cancelQueries({ queryKey: communityKeys.savedPosts() });

      // Snapshot previous values
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());
      const previousSavedPosts = queryClient.getQueryData(
        communityKeys.savedPosts()
      );

      // Helper function to update post reaction
      const updatePostReaction = (posts: IPost[] = []) =>
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                userReacted: !post.userReacted,
                reactions: {
                  ...post.reactions,
                  likes: post.userReacted
                    ? post.reactions.likes - 1
                    : post.reactions.likes + 1,
                },
              }
            : post
        );

      // Optimistically update posts list
      queryClient.setQueryData(communityKeys.postsList(), updatePostReaction);

      // Optimistically update saved posts if they exist
      queryClient.setQueryData(communityKeys.savedPosts(), updatePostReaction);

      return { previousPosts, previousSavedPosts };
    },
    onError: (_error, {}, context) => {
      // Revert optimistic updates
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
      if (context?.previousSavedPosts) {
        queryClient.setQueryData(
          communityKeys.savedPosts(),
          context.previousSavedPosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
      queryClient.invalidateQueries({ queryKey: communityKeys.savedPosts() });

      // Refresh balance and show toast
      queryClient.invalidateQueries({ queryKey: personalKeys.all });
      // toast.success("Reaction recorded! Reward received."); // Optional: Debounce or remove if too spammy
    },
  });
};

export const useGetSavedPostsCount = () => {
  return useQuery({
    queryKey: [...communityKeys.savedPosts(), "count"],
    queryFn: async () => {
      const response = await communityService.getSavedPostsCount();
      if (!response.success) {
        throw new Error(
          response.message || "Không thể tải số lượng bài viết đã lưu"
        );
      }
      return response.payload.count;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useCreateRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityService.createRepost(postId),
    onMutate: async (postId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(communityKeys.postsList());

      // Optimistically update repost count
      queryClient.setQueryData(communityKeys.postsList(), (old: IPost[] = []) =>
        old.map((post) =>
          post.id === postId
            ? {
                ...post,
                userReposted: true,
                reactions: {
                  ...post.reactions,
                  reposts: post.reactions.reposts + 1,
                },
              }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          communityKeys.postsList(),
          context.previousPosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postsList() });
    },
  });
};

export const useToggleSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityService.toggleSavePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });
      await queryClient.cancelQueries({ queryKey: communityKeys.savedPosts() });

      const queryCache = queryClient.getQueryCache();
      const postsQueries = queryCache.findAll({
        queryKey: communityKeys.postsList(),
      });
      const savedQueries = queryCache.findAll({
        queryKey: communityKeys.savedPosts(),
      });

      const previousData = new Map();

      const toggleSaveStatus = (posts: IPost[] = []) =>
        posts.map((post) =>
          post.id === postId ? { ...post, userSaved: !post.userSaved } : post
        );

      postsQueries.forEach((query) => {
        const data = query.state.data as IPost[];
        if (data) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, toggleSaveStatus(data));
        }
      });

      savedQueries.forEach((query) => {
        const data = query.state.data as IPost[];
        if (data) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, toggleSaveStatus(data));
        }
      });

      const savedCountKey = [...communityKeys.savedPosts(), "count"];
      const previousSavedCount = queryClient.getQueryData(savedCountKey);

      if (typeof previousSavedCount === "number") {
        let currentPost: IPost | undefined;
        for (const query of postsQueries) {
          const data = query.state.data as IPost[];
          if (data) {
            currentPost = data.find((p) => p.id === postId);
            if (currentPost) break;
          }
        }

        if (currentPost) {
          const newCount = currentPost.userSaved
            ? previousSavedCount - 1
            : previousSavedCount + 1;
          queryClient.setQueryData(savedCountKey, newCount);
          previousData.set(savedCountKey, previousSavedCount);
        }
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.postsList(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.savedPosts(),
        exact: false,
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        const result = await communityService.deletePost(postId);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.postsList() });
      await queryClient.cancelQueries({ queryKey: communityKeys.savedPosts() });
      await queryClient.cancelQueries({
        queryKey: communityKeys.postDetail(postId),
      });

      const queryCache = queryClient.getQueryCache();
      const postsQueries = queryCache.findAll({
        queryKey: communityKeys.postsList(),
      });
      const savedQueries = queryCache.findAll({
        queryKey: communityKeys.savedPosts(),
      });

      const previousData = new Map();

      const removePost = (posts: IPost[] = []) =>
        posts.filter((post) => post.id !== postId);

      postsQueries.forEach((query) => {
        const data = query.state.data;
        if (data && Array.isArray(data)) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, removePost(data));
        }
      });

      // Optimistically update saved posts queries
      savedQueries.forEach((query) => {
        const data = query.state.data;
        if (data && Array.isArray(data)) {
          previousData.set(query.queryKey, data);
          queryClient.setQueryData(query.queryKey, removePost(data));
        }
      });

      const savedCountKey = [...communityKeys.savedPosts(), "count"];
      const previousSavedCount = queryClient.getQueryData(savedCountKey);

      if (typeof previousSavedCount === "number") {
        let wasPostSaved = false;
        for (const query of [...postsQueries, ...savedQueries]) {
          const data = query.state.data;
          if (data && Array.isArray(data)) {
            const post = data.find((p) => p.id === postId);
            if (post?.userSaved) {
              wasPostSaved = true;
              break;
            }
          }
        }

        if (wasPostSaved) {
          const newCount = previousSavedCount - 1;
          queryClient.setQueryData(savedCountKey, newCount);
          previousData.set(savedCountKey, previousSavedCount);
        }
      }

      const postDetailKey = communityKeys.postDetail(postId);
      const previousPostDetail = queryClient.getQueryData(postDetailKey);
      if (previousPostDetail) {
        previousData.set(postDetailKey, previousPostDetail);
        queryClient.removeQueries({ queryKey: postDetailKey });
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.postsList(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.savedPosts(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...communityKeys.savedPosts(), "count"],
      });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => communityService.followUser(userId),
    onMutate: async (userId) => {
      const connectionsKey = communityKeys.connections();

      await queryClient.cancelQueries({ queryKey: connectionsKey });
      const previousConnections = queryClient.getQueryData(connectionsKey);

      queryClient.setQueryData(connectionsKey, (old: any) => {
        const filtered = old.filter((connection: IConnection) => {
          const match = String(connection.id) !== String(userId);
          return match;
        });

        return filtered;
      });

      return { previousConnections, connectionsKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousConnections && context?.connectionsKey) {
        queryClient.setQueryData(
          context.connectionsKey,
          context.previousConnections
        );
      }
    },
    onSettled: (_data, _error, _userId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.connections() });
      queryClient.invalidateQueries({ queryKey: communityKeys.follows() });
      queryClient.invalidateQueries({ queryKey: ["profile", "stats"] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => communityService.unfollowUser(userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.follows() });
      queryClient.invalidateQueries({ queryKey: communityKeys.connections() });
    },
  });
};

export const useGetConnections = () => {
  return useQuery({
    queryKey: communityKeys.connections(),
    queryFn: async () => {
      const response = await communityService.getConnectionSuggestions();
      if (!response.success) {
        throw new Error(response.message || "Không thể tải gợi ý kết nối");
      }
      return response.payload.connections;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
