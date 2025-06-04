import { Divider } from "@heroui/react";

export default function OrDivider() {
  return (
    <div className='container'>
      <div className='grid grid-cols-12 place-items-center'>
        <Divider className='col-span-5' />
        <span className='col-span-2 font-semibold text-gray-500'>OR</span>
        <Divider className='col-span-5' />
      </div>
    </div>
  );
}
