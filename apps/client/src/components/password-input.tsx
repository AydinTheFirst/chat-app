import { Button } from "@heroui/react";
import { LucideEye, LucideEyeOff } from "lucide-react";
import React from "react";

import { StyledInput, type StyledInputProps } from "./styled-input";

export default function PasswordInput(props: StyledInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const Icon = isPasswordVisible ? LucideEye : LucideEyeOff;

  const endContent = (
    <Button
      isIconOnly
      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      size='sm'
      variant='light'
    >
      <Icon className='h-5' />
    </Button>
  );

  return (
    <StyledInput
      {...props}
      endContent={endContent}
      type={isPasswordVisible ? "text" : "password"}
    />
  );
}
