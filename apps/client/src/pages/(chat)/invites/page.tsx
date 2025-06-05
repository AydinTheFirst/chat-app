import type { Channel } from "server-types";

import React, { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";

import { http } from "~/lib/http";

import type { Route } from "../+types/page";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    throw new Error("Code is required!");
  }

  const { data: channel } = await http.post<Channel>(`/invites/${code}/join`);

  if (!channel) {
    throw new Error(`Channel with code ${code} not found`);
  }

  return { channel };
};

export default function Page() {
  const navigate = useNavigate();
  const { channel } = useLoaderData<typeof clientLoader>();

  useEffect(() => {
    if (!channel) {
      navigate("/channels");
      return;
    }

    navigate(`/channels/${channel.id}`);
  }, [channel, navigate]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Joining Channel...</h1>
        <p className='mt-2'>You will be redirected shortly.</p>
      </div>
    </div>
  );
}
