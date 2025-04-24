
import * as React from "react";

interface IndianProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

const Indian = ({ 
  size = 24, 
  strokeWidth = 2, 
  ...props 
}: IndianProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v20" />
    <path d="M2 5h20" />
    <path d="M4 9h16" />
    <path d="M6 13h12" />
    <path d="M8 17h8" />
  </svg>
);

export { Indian };
