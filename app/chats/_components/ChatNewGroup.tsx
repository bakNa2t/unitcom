import { useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { Users } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";

const CreateChatNewGroupSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters long",
  }),
  members: z.array(z.string()).min(2, {
    message: "Group must have at least 2 members",
  }),
});

export const ChatNewGroup = () => {
  const contacts = useQuery(api.contacts.get);

  const { mutate: createChatGroup, state: createChatGroupState } =
    useMutationHandler(api.contacts.createGroup);

  const form = useForm<z.infer<typeof CreateChatNewGroupSchema>>({
    resolver: zodResolver(CreateChatNewGroupSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger className="w-full">
          <Users size={20} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <Form {...form} onSubmit={form.handleSubmit(() => {})}>
            <form className="">
              <fieldset>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Group name..." {...field} />
                      </FormControl>

                      <FormDescription>
                        This is the name of the group
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
