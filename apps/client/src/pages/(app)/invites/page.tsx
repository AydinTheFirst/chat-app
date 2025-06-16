import { Channel, plainToInstance } from "dactoly.js";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";

import { http } from "~/lib/http";
import { useChannelStore } from "~/store/channel-store";

import type { Route } from "../+types/page";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    throw new Error("Code is required!");
  }

  try {
    const { data: channel } = await http.post<Channel>(`/invites/${code}/join`);

    if (!channel) {
      throw new Error(`Channel with code ${code} not found`);
    }

    return { channel };
  } catch (error) {
    return {
      channel: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

export default function Page() {
  const navigate = useNavigate();
  const addChannel = useChannelStore((s) => s.addChannel);
  const { channel, error } = useLoaderData<typeof clientLoader>();

  useEffect(() => {
    if (!channel) return;
    addChannel(plainToInstance(Channel, channel));

    navigate(`/channels/${channel.id}`);
  }, [channel, navigate, addChannel]);

  return (
    <div className='flex h-screen items-center justify-center'>
      {error && (
        <div className='text-center text-red-500'>
          <h1 className='text-2xl font-bold'>Error</h1>
          <p className='mt-2'>{error}</p>
          <p className='mt-4'>Please check the invite code and try again.</p>
        </div>
      )}

      {channel && (
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Joining Channel...</h1>
          <p className='mt-2'>You will be redirected shortly.</p>
        </div>
      )}
    </div>
  );
}
