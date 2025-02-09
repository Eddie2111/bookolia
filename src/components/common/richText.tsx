"use client";
import DOMPurify from "dompurify";

const LongText = ({
  longText,
  truncate = false,
}: {
  longText: string;
  truncate?: boolean;
}) => {
  const sanitizedText = DOMPurify.sanitize(longText);

  if (truncate && sanitizedText.length > 48) {
    const plainText = sanitizedText.replace(/<\/?(p|a|br|ol|li)\b[^>]*>/g, "");

    return <div className="text-gray-400">{plainText.slice(0, 48)}...</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedText }}
      className="text-gray-400"
    ></div>
  );
};

export default LongText;
