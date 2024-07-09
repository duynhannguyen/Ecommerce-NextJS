import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Socials from "./socials";
import BackButton from "./back-button";

type CardWrapperProps = {
  children: ReactNode;
  cardTitle: string;
  BackButtonHref: string;
  BackButtonLabel: string;
  showSocials: boolean;
};

const AuthCard = ({
  children,
  cardTitle,
  BackButtonHref,
  BackButtonLabel,
  showSocials,
}: CardWrapperProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={BackButtonLabel} href={BackButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
