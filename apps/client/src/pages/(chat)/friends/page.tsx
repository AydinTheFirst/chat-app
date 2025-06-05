import type { Channel } from "server-types";

import { Button, Card, CardBody } from "@heroui/react";
import {
  LucideMessageSquare,
  LucideUserCheck2,
  LucideUserX2
} from "lucide-react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";

import type { FriendshipWithUser } from "~/types";

import CurrentUserCard from "~/components/current-user-card";
import { UserCard } from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import AddFriend from "./add-friend";

export const clientLoader = async () => {
  const { data: friends } =
    await http.get<FriendshipWithUser[]>("/friendships");

  const { data: pending } = await http.get<FriendshipWithUser[]>(
    "/friendships/pending"
  );

  return { friends, pending };
};

export default function Friends() {
  const { friends, pending } = useLoaderData<typeof clientLoader>();

  const { user } = useAuth();

  if (!user) {
    return (
      <div className='text-center'>Please log in to view your friends.</div>
    );
  }

  return (
    <div className='flex h-screen flex-col gap-3'>
      <Card
        className='dark:bg-[#1D1F1F]'
        radius='none'
      >
        <CardBody className='grid grid-cols-2 gap-3'>
          <div>
            <CurrentUserCard />
          </div>
          <div className='flex justify-end'>
            <AddFriend />
          </div>
        </CardBody>
      </Card>

      <div className='container flex-1 overflow-y-auto py-4'>
        <h2 className='mb-3 text-xl font-bold'>
          Friends
          <small className='ml-2 text-gray-500'>({friends.length})</small>
        </h2>
        <div className='grid gap-3'>
          {friends.length === 0 && (
            <div className='text-gray-500'>You have no friends yet.</div>
          )}

          {friends.map((friend) => (
            <FriendCard
              friend={friend}
              key={friend.id}
            />
          ))}
          <br />

          <h2 className='mb-3 text-xl font-bold'>
            Pending Requests
            <small className='ml-2 text-gray-500'>({pending.length})</small>
          </h2>
          <div className='grid gap-3'>
            {pending.length === 0 && (
              <div className='text-gray-500'>You have no pending requests.</div>
            )}

            {pending.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendCard({ friend }: { friend: FriendshipWithUser }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const revalidator = useRevalidator();

  const user = friend.to.id === currentUser?.id ? friend.from : friend.to;

  const handleDM = async () => {
    try {
      const { data: channel } = await http.post<Channel>(
        `/channels/dm/${user.id}`
      );
      navigate(`/channels/${channel.id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleRemove = async () => {
    try {
      await http.delete(`/friendships/${friend.id}`);
      toast.success(`Removed ${user.username} from friends.`);
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card isHoverable>
      <CardBody className='grid grid-cols-2'>
        <div>
          <UserCard
            avatarProps={{
              src: `https://api.dicebear.com/9.x/bottts/svg?seed=${user.username}`
            }}
            description={user.username}
            name={user.displayName}
          />
        </div>
        <div className='flex items-center justify-end gap-2'>
          <Button
            color='primary'
            isIconOnly
            onPress={handleDM}
            variant='light'
          >
            <LucideMessageSquare />
          </Button>
          <Button
            color='danger'
            isIconOnly
            onPress={handleRemove}
            variant='light'
          >
            <LucideUserX2 />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

const PendingRequestCard = ({ request }: { request: FriendshipWithUser }) => {
  const revalidator = useRevalidator();

  const handleAccept = async () => {
    try {
      await http.post(`/friendships/${request.id}/accept`);
      toast.success(`Friend request from ${request.from.username} accepted!`);
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  const handleReject = async () => {
    try {
      await http.post(`/friendships/${request.id}/reject`);
      toast.success(`Friend request from ${request.from.username} rejected!`);
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card isHoverable>
      <CardBody className='grid grid-cols-2'>
        <div>
          <UserCard
            avatarProps={{
              src: `https://api.dicebear.com/9.x/bottts/svg?seed=${request.from.username}`
            }}
            key={request.id}
            name={request.from.username}
          />
        </div>
        <div className='flex items-center justify-end gap-3'>
          <Button
            color='success'
            isIconOnly
            onPress={handleAccept}
            variant='light'
          >
            <LucideUserX2 />
          </Button>
          <Button
            color='danger'
            isIconOnly
            onPress={handleReject}
            variant='light'
          >
            <LucideUserCheck2 />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
