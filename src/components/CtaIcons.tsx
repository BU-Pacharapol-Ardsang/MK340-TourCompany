type IconProps = {
  className?: string;
};

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 12H5" />
      <path d="m11 5-7 7 7 7" />
    </svg>
  );
}

export function MessageIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 18.5c-2.8 0-5-2.1-5-4.8V9.8C2 7.2 4.2 5 7 5h10c2.8 0 5 2.2 5 4.8v3.9c0 2.7-2.2 4.8-5 4.8H9.9L6 22v-3.5H7Z" />
      <path d="M8 10.5h8" />
      <path d="M8 14h5" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 16.2v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.2 19.2 0 0 1-5.8-5.8 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 3.2 1h2.5a2 2 0 0 1 2 1.7l.4 3a2 2 0 0 1-.6 1.8L5.7 9.3a16 16 0 0 0 9 9l1.8-1.8a2 2 0 0 1 1.8-.6l3 .4a2 2 0 0 1 1.7 1.9Z" />
    </svg>
  );
}
