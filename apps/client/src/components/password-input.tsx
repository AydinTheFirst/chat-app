import { Button, Input, type InputProps } from "@heroui/react";
import { LucideEye, LucideEyeOff } from "lucide-react";
import React from "react";

export default function PasswordInput(props: InputProps) {
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
    <Input
      {...props}
      endContent={endContent}
      type={isPasswordVisible ? "text" : "password"}
    />
  );
}
