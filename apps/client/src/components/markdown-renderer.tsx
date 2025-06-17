import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import onedark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";

function MarkdownRenderer({ children }: React.PropsWithChildren) {
  return (
    <ReactMarkdown
      components={{
        a: (props) => (
          <a
            className='text-blue-500 hover:underline'
            {...props}
            rel='noopener noreferrer'
            target='_blank'
          />
        ),
        code: ({ children }) => (
          <SyntaxHighlighter
            language='javascript'
            style={onedark}
          >
            {typeof children === "string" ? children : String(children)}
          </SyntaxHighlighter>
        )
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children?.toString()}
    </ReactMarkdown>
  );
}

export default memo(MarkdownRenderer);
