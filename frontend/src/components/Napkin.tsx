import { useEffect, useRef } from "react";

interface INapkinProps extends React.HTMLProps<HTMLDivElement> {
  value: string;
  onContentChange: (value: string) => void;
}

export default function Napkin({ value, onContentChange, style, ...rest }: INapkinProps) {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentEditableRef.current === null) {
      return;
    }

    if (contentEditableRef.current.innerHTML !== value) {
      contentEditableRef.current.innerHTML = value;
    }
  });

  function handleInput(event: React.FormEvent<HTMLDivElement>) {
    onContentChange((event.target as HTMLDivElement).innerHTML || "");
  }

  return (
    <div
      contentEditable="true"
      ref={contentEditableRef}
      onInput={handleInput}
      style={{ minHeight: '200px', backgroundColor: '#f3f4f6', padding: '10px', ...style }}
      {...rest}
    />
  );
}
