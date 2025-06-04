import type { Channel } from "server-types";

import { Button, Card, CardBody, Textarea, User } from "@heroui/react";
import {
  LucideEllipsisVertical,
  LucidePlus,
  LucideSearch,
  LucideSend,
  LucideSticker
} from "lucide-react";
import { useLoaderData } from "react-router";

import { http } from "~/lib/http";

import type { Route } from "./+types/page";

import MessageBubble from "./message-bubble";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { channelId } = params;

  if (!channelId) {
    throw new Error("Channel ID is required");
  }

  const { data: channel } = await http.get<Channel>(`/channels/${channelId}`);

  if (!channel) {
    throw new Error(`Channel with ID ${channelId} not found`);
  }

  return { channel };
};

export default function Page() {
  const { channel } = useLoaderData<typeof clientLoader>();

  return (
    <div className='flex h-screen flex-col'>
      <Card
        className='dark:bg-[#1D1F1F]'
        radius='none'
        shadow='none'
      >
        <CardBody>
          <div className='flex justify-between'>
            <div>
              <User
                avatarProps={{
                  src: `https://api.dicebear.com/9.x/bottts/svg?seed=${channel.name}`
                }}
                description='none'
                name={channel.name}
              />
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                isIconOnly
                variant='light'
              >
                <LucideSearch />
              </Button>
              <Button
                isIconOnly
                variant='light'
              >
                <LucideEllipsisVertical />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <main className='flex-1 overflow-y-auto'>
        <div className='container grid gap-3 py-10'>
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
            fromUser={false}
            message='Hey Sup?'
            userName='Aylin'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Not much, you?'
            userName='Emre'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/46.jpg'
            fromUser={false}
            message='Just working on a project. You?'
            userName='Aylin'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Same here, lots of coding lately.'
            userName='Emre'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
            fromUser={false}
            message='What are you building?'
            userName='Aylin'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='A chat app for fun!'
            userName='Emre'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/46.jpg'
            fromUser={false}
            message='That sounds cool. Using React?'
            userName='Aylin'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Yep, with TypeScript and Tailwind.'
            userName='Emre'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Always happy to get feedback if you have any!'
            userName='Emre'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
            fromUser={false}
            message="Sure! I'll check it out and let you know."
            userName='Aylin'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/46.jpg'
            fromUser={false}
            message='Are you planning to open source it?'
            userName='Aylin'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message="Maybe, once it's a bit more polished."
            userName='Emre'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
            fromUser={false}
            message="Let us know, we'd love to contribute!"
            userName='Aylin'
          />

          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
            fromUser={false}
            message='Nice stack! Need any help?'
            userName='Aylin'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Maybe later, thanks! 😊'
            userName='Emre'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/women/46.jpg'
            fromUser={false}
            message='No problem. Good luck!'
            userName='Aylin'
          />
          <MessageBubble
            avatarUrl='https://randomuser.me/api/portraits/men/45.jpg'
            fromUser={true}
            message='Thanks! Talk soon.'
            userName='Emre'
          />
        </div>
      </main>

      <Card
        className='dark:bg-[#1D1F1F]'
        radius='none'
        shadow='none'
      >
        <CardBody>
          <div className='flex items-center gap-1'>
            <Button
              isIconOnly
              variant='light'
            >
              <LucidePlus />
            </Button>
            <Button
              isIconOnly
              variant='light'
            >
              <LucideSticker />
            </Button>
            <Textarea
              fullWidth
              minRows={1}
              placeholder='Type your message...'
              variant='bordered'
            />
            <Button
              isIconOnly
              variant='light'
            >
              <LucideSend />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
