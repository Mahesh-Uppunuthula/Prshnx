import { usersApi } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

export const useUserDetails = () => {
  return useQuery({
    queryKey: ["getUserDetails"],
    queryFn: usersApi.getUserDetails,
    
    staleTime: Infinity,
  });
};
