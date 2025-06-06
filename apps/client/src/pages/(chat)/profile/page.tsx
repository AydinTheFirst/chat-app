import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Input,
  Navbar,
  NavbarContent,
  Textarea,
  useDisclosure
} from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";

import CdnAvatar from "~/components/cdn-avatar";
import CdnImage from "~/components/cdn-image";
import ConfirmModal from "~/components/confirm-modal";
import PasswordInput from "~/components/password-input";
import { StyledButton } from "~/components/styled-button";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { getFormData } from "~/lib/utils";

import SidebarToggler from "../sidebar-toggler";
import UpdateAvatar from "./update-avatar";
import UpdateBanner from "./update-banner";

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = getFormData(e);

    setIsLoading(true);
    try {
      await http.patch("/profiles/me", formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  if (!user.profile) {
    return "Profile is not found!";
  }

  return (
    <div className='flex h-screen flex-col gap-3'>
      <Navbar
        className='bg-content1 shadow'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          <SidebarToggler className='md:hidden' />
          <h2 className='text-lg font-semibold'>Profile</h2>
        </NavbarContent>
      </Navbar>
      <div className='container flex-1 overflow-y-auto'>
        <div>
          <Card className='mx-auto my-4 w-full max-w-2xl'>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Edit Profile</h2>
            </CardHeader>
            <CardBody className='relative'>
              <div className='group relative h-56 overflow-hidden'>
                {user.profile.bannerUrl && (
                  <CdnImage
                    className='h-full w-full rounded object-contain'
                    src={user.profile.bannerUrl}
                  />
                )}
                {!user.profile.bannerUrl && (
                  <div className='h-full w-full bg-blue-500' />
                )}
                <div className='absolute end-0 top-0 z-10 opacity-0 group-hover:opacity-100'>
                  <UpdateBanner />
                </div>
              </div>
              <div className='group absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform'>
                {user.profile.avatarUrl && (
                  <CdnAvatar
                    className='h-20 w-20'
                    src={user.profile.avatarUrl}
                  />
                )}
                {!user.profile.avatarUrl && (
                  <Avatar
                    className='h-20 w-20'
                    name={user.profile.displayName}
                  />
                )}
                <div className='absolute end-0 bottom-0 z-10 opacity-0 group-hover:opacity-100'>
                  <UpdateAvatar />
                </div>
              </div>
            </CardBody>
            <CardBody>
              <form
                className='grid gap-3'
                onSubmit={handleSubmit}
              >
                <Input
                  isRequired
                  label='Username'
                  value={user.username}
                />
                <Input
                  defaultValue={user.profile.displayName}
                  isRequired
                  label='Display Name'
                  name='displayName'
                />
                <Textarea
                  defaultValue={user.profile.bio ?? ""}
                  label='Bio'
                  name='bio'
                  rows={3}
                />
                <Input
                  defaultValue={user.profile.websiteUrl ?? ""}
                  label='Website'
                  name='websiteUrl'
                  type='url'
                />
                <StyledButton
                  isLoading={isLoading}
                  type='submit'
                >
                  Update Profile
                </StyledButton>
              </form>
            </CardBody>
          </Card>
          <UpdatePasswordCard />
          <DangerZoneCard />
        </div>
      </div>
    </div>
  );
}

function DangerZoneCard() {
  const confirmModal = useDisclosure();

  const handleDeleteAccount = async () => {
    try {
      await http.delete("/users/me");
      toast.success("Account deleted successfully!");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Card className='mx-auto my-4 w-full max-w-2xl'>
        <CardHeader>
          <h2 className='text-lg font-semibold text-red-600'>Danger Zone</h2>
        </CardHeader>
        <CardBody className='grid gap-3'>
          <p className='max-w-md text-sm text-gray-500'>
            Deleting your account is permanent and cannot be undone. All your
            data will be lost.
          </p>
          <div>
            <StyledButton
              color='danger'
              onClick={confirmModal.onOpen}
            >
              Delete Account
            </StyledButton>
          </div>
        </CardBody>
      </Card>
      <ConfirmModal
        message='Are you sure you want to delete your account? This action cannot be undone.'
        onConfirm={handleDeleteAccount}
        {...confirmModal}
      />
    </>
  );
}

function UpdatePasswordCard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = getFormData(e);

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await http.patch("/auth/password", formData);
      toast.success("Password updated successfully!");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  return (
    <Card className='mx-auto my-4 w-full max-w-2xl'>
      <CardHeader>
        <h2 className='text-lg font-semibold'>Update Password</h2>
      </CardHeader>
      <CardBody>
        <form
          className='grid gap-3'
          onSubmit={handleSubmit}
        >
          <PasswordInput
            isRequired
            label='Old Password'
            name='oldPassword'
            type='password'
          />

          <PasswordInput
            isRequired
            label='New Password'
            name='newPassword'
            type='password'
          />

          <PasswordInput
            isRequired
            label='Confirm New Password'
            name='confirmNewPassword'
            type='password'
          />

          <StyledButton
            isLoading={isLoading}
            type='submit'
          >
            Update Password
          </StyledButton>
        </form>
      </CardBody>
    </Card>
  );
}
