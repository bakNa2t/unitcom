import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

type MutationState = "idle" | "loading" | "success" | "error";

export const useMutationHandler = <T, P>(
  //   mutation: (params: P) => Promise<T>
  mutation: any
) => {
  const [state, setState] = useState<MutationState>("idle");
  const mutationFunc = useMutation(mutation);

  const mutate = useCallback(
    async (payload: P): Promise<T | null> => {
      setState("loading");

      try {
        const result = await mutationFunc(payload);
        setState("success");
        return result;
      } catch (error) {
        setState("error");
        console.log("Mutation error", error);
        throw error;
      } finally {
        setState("idle");
      }
    },
    [mutationFunc]
  );

  return { state, mutate };
};
