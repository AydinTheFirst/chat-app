import { Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Heading } from "~/components/heading";
import OrDivider from "~/components/or";
import PasswordInput from "~/components/password-input";
import { StyledButton } from "~/components/styled-button";
import { StyledInput } from "~/components/styled-input";
import { handleError, http } from "~/lib/http";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    try {
      await http.post("/auth/register", data);
      toast.success("Registration successful! You can now log in.");
      navigate("/login");
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
            Welcome to the Registration Page
          </Heading>
          <p className='text-center'>
            Please fill out the form below to create a new account.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <StyledInput
              description='Choose a unique username for your account.'
              isRequired
              label='Display Name'
              name='displayName'
            />

            <StyledInput
              description='Enter your username or email address.'
              isRequired
              label='Username'
              name='username'
            />

            <StyledInput
              description='Enter your email address.'
              isRequired
              label='Email'
              name='email'
              type='email'
            />

            <PasswordInput
              description='Enter your password.'
              isRequired
              label='Password'
              name='password'
            />
            <StyledButton type='submit'>Register</StyledButton>
          </form>
        </CardBody>
        <OrDivider />
        <CardBody>
          <p className='text-center'>
            Already have an account? <Link href='/login'>Log in here</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
