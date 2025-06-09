import { Card, CardBody, CardHeader, Input, Link } from "@heroui/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Heading } from "~/components/heading";
import OrDivider from "~/components/or";
import PasswordInput from "~/components/password-input";
import { StyledButton } from "~/components/styled-button";
import { handleError, http, saveToken } from "~/lib/http";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    try {
      const response = await http.post("/auth/login", data);
      saveToken(response.data.token);
      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='center container h-screen'>
      <Card
        className='w-full max-w-md'
        shadow='none'
      >
        <CardHeader className='flex flex-col gap-2'>
          <Heading
            className='text-center'
            level={3}
          >
            Welcome to the Login Page
          </Heading>
          <p className='text-center'>
            Please enter your credentials to continue.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              description='Enter your username or email address.'
              isRequired
              label='Username'
              name='username'
            />

            <PasswordInput
              description='Enter your password.'
              isRequired
              label='Password'
              name='password'
            />
            <StyledButton type='submit'>Login</StyledButton>
          </form>
        </CardBody>
        <OrDivider />
        <CardBody>
          <p className='text-center'>
            Don't have an account? <Link href='/register'>Register here</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
