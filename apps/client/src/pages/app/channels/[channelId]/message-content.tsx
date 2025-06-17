import React, { memo, useMemo } from "react";
import Markdown from "react-markdown";

interface MessageContentProps {
  content: string;
}

const MessageContent = memo(({ content }: MessageContentProps) => {
  const memoizedContent = useMemo(() => content, [content]);

  return <Markdown>{memoizedContent}</Markdown>;
});

export default MessageContent;
