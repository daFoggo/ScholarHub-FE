import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  chatbotService,
  type IChatDTO,
  type IThreadDTO,
} from "../services/chatbot";

export const chatbotKeys = {
  all: ["chatbot"] as const,
  chats: () => [...chatbotKeys.all, "chats"] as const,
  chat: (userId: string, threadId: string) =>
    [...chatbotKeys.chats(), userId, threadId] as const,
  threads: () => [...chatbotKeys.all, "threads"] as const,
  threadsList: (userId: string) => [...chatbotKeys.threads(), userId] as const,
};

export const useGetChat = (params: { user_id: string; thread_id: string }) => {
  const { user_id, thread_id } = params;

  return useQuery({
    queryKey: chatbotKeys.chat(user_id, thread_id),
    queryFn: async () => {
      const response = await chatbotService.getChat({ user_id, thread_id });
      return response.payload.messages;
    },
    enabled: !!user_id && !!thread_id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: IChatDTO) => {
      const response = await chatbotService.postChat(chatData);
      return response.payload.answer;
    },
    onSuccess: (data, variables) => {
      const previousMessages = queryClient.getQueryData(
        chatbotKeys.chat(variables.user_id, variables.thread_id)
      ) as Array<any> | undefined;

      if (previousMessages) {
        const newMessage = {
          content: variables.question,
          role: "user",
          created_at: new Date().toISOString(),
        };

        const botResponse = {
          content: data,
          role: "assistant",
          created_at: new Date().toISOString(),
        };

        queryClient.setQueryData(
          chatbotKeys.chat(variables.user_id, variables.thread_id),
          [...previousMessages, newMessage, botResponse]
        );
      }

      // Invalidate để refetch data mới từ server
      queryClient.invalidateQueries({
        queryKey: chatbotKeys.chat(variables.user_id, variables.thread_id),
      });

      queryClient.invalidateQueries({
        queryKey: chatbotKeys.threadsList(variables.user_id),
      });
    },
  });
};

export const useNewThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadData: IThreadDTO) => {
      const response = await chatbotService.newThread(threadData);
      return response.payload.thread_id;
    },
    onSuccess: (newThreadId, variables) => {

      // Tạo thread object với đúng structure
      const newThread = {
        thread_id: newThreadId, // Sử dụng thread_id thay vì id
        user_id: variables.user_id,
        created_at: new Date().toISOString(),
        message_count: 0,
        last_message: new Date().toISOString(),
        latest_question: null,
        latest_answer: null,
      };

      // Update cache với thread mới
      const previousThreads = queryClient.getQueryData(
        chatbotKeys.threadsList(variables.user_id)
      ) as Array<any> | undefined;

      if (previousThreads) {
        queryClient.setQueryData(chatbotKeys.threadsList(variables.user_id), [
          newThread,
          ...previousThreads,
        ]);
      } else {
        // Nếu chưa có threads, tạo array mới
        queryClient.setQueryData(chatbotKeys.threadsList(variables.user_id), [
          newThread,
        ]);
      }

      // Khởi tạo chat data rỗng cho thread mới
      queryClient.setQueryData(
        chatbotKeys.chat(variables.user_id, newThreadId || ""),
        []
      );

      // Invalidate để đảm bảo data được sync
      queryClient.invalidateQueries({
        queryKey: chatbotKeys.threadsList(variables.user_id),
      });
    },
    onError: (error) => {
      console.error("Failed to create thread:", error);
    },
  });
};

export const useDeleteThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { thread_id: string; user_id: string }) => {
      const response = await chatbotService.deleteThread({
        thread_id: params.thread_id,
      });
      return response.success;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: chatbotKeys.threadsList(variables.user_id),
      });

      const previousThreads = queryClient.getQueryData(
        chatbotKeys.threadsList(variables.user_id)
      ) as Array<any> | undefined;

      if (previousThreads) {
        queryClient.setQueryData(
          chatbotKeys.threadsList(variables.user_id),
          // Sử dụng thread_id thay vì id
          previousThreads.filter(
            (thread) => thread.thread_id !== variables.thread_id
          )
        );
      }

      queryClient.removeQueries({
        queryKey: chatbotKeys.chat(variables.user_id, variables.thread_id),
      });

      return { previousThreads };
    },
    onError: (_, variables, context) => {
      if (context?.previousThreads) {
        queryClient.setQueryData(
          chatbotKeys.threadsList(variables.user_id),
          context.previousThreads
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatbotKeys.threadsList(variables.user_id),
      });
    },
  });
};

export const useThreadsList = (params: IThreadDTO) => {
  const { user_id } = params;

  return useQuery({
    queryKey: chatbotKeys.threadsList(user_id),
    queryFn: async () => {
      const response = await chatbotService.threadsList();
      return response.payload.threads;
    },
    enabled: !!user_id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
