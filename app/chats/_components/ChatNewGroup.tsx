import { useQuery } from "convex/react";

import { useMutationHandler } from "@/hooks/useMutationHandler";

import { api } from "@/convex/_generated/api";

export const ChatNewGroup = () => {
  const contacts = useQuery(api.contacts.get);

  const { mutate: createChatGroup, state: createChatGroupState } =
    useMutationHandler(api.contacts.createGroup);

  return <div>ChatNewGroup</div>;
};
