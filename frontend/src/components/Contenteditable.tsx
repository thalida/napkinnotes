import { useEffect, useRef } from "react";

interface IContenteditableProps extends React.HTMLProps<HTMLDivElement> {
  value: string;
  onContentChange: (value: string) => void;
}

export default function Contenteditable({ value, onContentChange, ...rest }: IContenteditableProps) {
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
      {...rest}
    />
  );
}
