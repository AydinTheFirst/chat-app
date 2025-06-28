import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { toast } from "sonner";
import { handleError } from "utils/handleError";

import PasswordInput from "~/components/password-input";
import dactoly from "~/lib/dactoly";

export default function Page() {
  const handleSubmit = async (formData: FormData) => {
    try {
      const { data } = await dactoly.api.post("/auth/login", formData);

      localStorage.setItem("token", data.token);

      toast.success("Login successful!");
      location.href = "/";
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='grid h-screen place-items-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-col items-start'>
          <h2 className='text-2xl font-bold'>Login</h2>
          <p className='text-sm text-gray-500'>
            Please enter your username and password to continue.
          </p>
        </CardHeader>
        <CardBody>
          <form
            action={handleSubmit}
            className='grid gap-3'
          >
            <Input
              isRequired
              label='Username'
              name='username'
            />

            <PasswordInput
              isRequired
              label='Password'
              name='password'
            />

            <Button type='submit'>Login</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
