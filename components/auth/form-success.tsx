import { CheckCircle2 } from "lucide-react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-teal-400/25 flex gap-2 text-xs my-2 font-medium items-center text-secondary-foreground p-3 rounded-md ">
      <CheckCircle2 className="w-4 h-4 " />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
