import useFormattedContent from "~/hooks/use-formatted-content";

import { MarkdownRenderer } from "./markdown-renderer";

export default function MessageContent({ content }: { content: string }) {
  const formattedContent = useFormattedContent(content);

  return (
    <div className='prose dark:prose-invert text-sm break-all'>
      <MarkdownRenderer>{formattedContent}</MarkdownRenderer>
    </div>
  );
}
