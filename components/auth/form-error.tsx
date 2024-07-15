import { AlertCircle } from "lucide-react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/25 flex gap-2 text-xs my-2 font-medium items-center text-secondary-foreground p-3 rounded-md ">
      <AlertCircle className="w-4 h-4 " />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
