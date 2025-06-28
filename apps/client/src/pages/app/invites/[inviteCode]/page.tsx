import { useEffect } from "react";
import {
  type ClientLoaderFunctionArgs,
  useLoaderData,
  useNavigate
} from "react-router";

import dactoly from "~/lib/dactoly";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { inviteCode } = params;

  if (!inviteCode) {
    return {
      error: {
        message: "Invite code is required",
        status: 400
      }
    };
  }

  try {
    const res = await dactoly.invites.joinByCode(inviteCode);

    return {
      channelId: res.channelId,
      message: "Invite code is valid",
      success: true
    };
  } catch {
    return {
      error: {
        message: "Invalid invite code",
        status: 404
      }
    };
  }
};

export default function Page() {
  const { channelId, error } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!channelId) return;
    navigate(`/app/channels/${channelId}`);
  }, [channelId, navigate]);

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <h1 className='text-2xl font-bold text-red-500'>{error.message}</h1>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <h1 className='text-2xl font-bold text-green-500'>
        Invite code is valid! Redirecting...
      </h1>
    </div>
  );
}
