import type { Application } from "server-types";

import { Link, useDisclosure } from "@heroui/react";
import { useLoaderData } from "react-router";

import { StyledButton } from "~/components/styled-button";
import { http } from "~/lib/http";

import CreateAppModal from "./create-app";

export const clientLoader = async () => {
  const { data: applications } = await http.get<Application[]>("/applications");

  return { applications };
};

export default function Page() {
  const { applications } = useLoaderData<typeof clientLoader>();

  const createAppModal = useDisclosure();

  return (
    <>
      <div className='grid gap-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold'>
              Applications{" "}
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                ({applications.length})
              </span>
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Applications are used to authenticate and authorize your API
              requests. You can create multiple applications for different use
              cases.
            </p>
          </div>
          <div className='flex justify-end'>
            <StyledButton onPress={createAppModal.onOpen}>
              Create Application
            </StyledButton>
          </div>
        </div>
        <div>
          <ul>
            {applications.map((app) => (
              <li
                className='mb-2'
                key={app.id}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-semibold'>{app.name}</span>
                  <Link href={`/applications/${app.id}`}>View Details</Link>
                </div>
              </li>
            ))}
          </ul>
          {applications.length === 0 && (
            <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
              You have no applications yet. Click the button above to create
              one.
            </p>
          )}
        </div>
      </div>

      <CreateAppModal {...createAppModal} />
    </>
  );
}
