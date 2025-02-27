import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { Users, X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { api } from "@/convex/_generated/api";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { Card } from "@/components/ui/card";

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

  const members = form.watch("members", []);

  const unselectedContacts = useMemo(() => {
    return contacts
      ? contacts.filter((contact) => !members.includes(contact._id))
      : [];
  }, [contacts, members]);

  const onCreateChatNewGroup = async ({
    name,
    members,
  }: z.infer<typeof CreateChatNewGroupSchema>) => {
    console.log(name, members);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="w-full">
          <Users size={20} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(onCreateChatNewGroup)}
            >
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

                <FormField
                  control={form.control}
                  name="members"
                  render={() => (
                    <FormItem>
                      <FormLabel>Contacts</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            disabled={unselectedContacts.length === 0}
                          >
                            <Button variant="outline" className="ml-4">
                              Select contacts
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-full">
                            <DropdownMenuLabel>Contacts</DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            {unselectedContacts.map((contact) => (
                              <DropdownMenuCheckboxItem
                                key={contact._id}
                                className="flex items-center gap-2 w-full p-2"
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    form.setValue("members", [
                                      ...members,
                                      contact._id,
                                    ]);
                                  }
                                }}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={contact.imageUrl} />
                                  <AvatarFallback>
                                    {contact.username.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>

                                <h4 className="truncate">{contact.username}</h4>
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>

              {members.length ? (
                <Card className="flex otems-center gap-3 w-full h-24 p-2 overflow-x-auto">
                  {contacts
                    ?.filter((contact) => members.includes(contact._id))
                    .map((friend) => (
                      <div
                        key={friend._id}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                              {friend.username.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <X
                            onClick={() =>
                              form.setValue("members", [
                                ...members.filter((id) => id !== friend._id),
                              ])
                            }
                            className="absolute w-4 h-4 text-muted-foreground bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                </Card>
              ) : null}

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createChatGroupState === "loading"}
                >
                  Create group
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
