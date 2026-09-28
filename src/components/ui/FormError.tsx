import { FaExclamationTriangle } from "react-icons/fa";

/** Validation / submit error shown above a form's submit button. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="p-2 bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-red-700 flex items-center gap-1.5">
      <FaExclamationTriangle className="flex-shrink-0" /> {message}
    </div>
  );
}
