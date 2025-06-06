import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import onedark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      components={{
        a: (props) => (
          <a
            className='underline'
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
      {content}
    </ReactMarkdown>
  );
}
