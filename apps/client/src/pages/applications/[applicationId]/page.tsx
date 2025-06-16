import type { Application, Profile, Token } from "server-types";

import {
  type ClientLoaderFunctionArgs,
  useLoaderData,
  useRevalidator
} from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { handleError, http } from "~/lib/http";

interface ApplicationWithDetails extends Application {
  bot: {
    profile: Profile;
    tokens: Token[];
  };
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { applicationId } = params;

  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  const { data: application } = await http.get<ApplicationWithDetails>(
    `/applications/${applicationId}`
  );

  return { application };
};

export default function Page() {
  const { application } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();

  const onCreateToken = async () => {
    try {
      await http.post(`/applications/${application.id}/token`);
      toast.success("Token created successfully!");
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='grid gap-5'>
      <div className='grid gap-3'>
        <h1 className='text-2xl font-bold'>{application.name}</h1>
        <p>Description: {application.description}</p>
        <p>
          Created At: {new Date(application.createdAt).toLocaleDateString()}
        </p>
        <p>App ID: {application.id}</p>
      </div>
      <div className='grid gap-3'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div>
            <h2 className='mb-2 text-xl font-semibold'>Tokens</h2>
          </div>
          <div className='flex justify-end'>
            <StyledButton onPress={onCreateToken}>Create Token</StyledButton>
          </div>
        </div>
        <ul className='grid gap-3'>
          {application.bot.tokens.map((token) => (
            <li
              className='flex items-center justify-between rounded-md border bg-gray-50 p-3 dark:bg-gray-800'
              key={token.id}
            >
              <span className='font-medium'>{token.token}</span> -{" "}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
