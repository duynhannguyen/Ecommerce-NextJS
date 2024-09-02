import { DashBoardNav } from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import {
  BarChart,
  Package,
  PenSquare,
  Settings,
  Ticket,
  TicketPlus,
  Truck,
} from "lucide-react";
import React from "react";

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
          {
            label: "Coupons",
            path: "/dashboard/coupon",
            icon: <Ticket size={16} />,
          },
          {
            label: "Discount",
            path: "/dashboard/coupon/create-coupon",
            icon: <TicketPlus size={16} />,
          },
        ]
      : [];

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;
  const allLinks = [...adminLinks, ...userLinks];
  return (
    <div>
      <DashBoardNav allLinks={allLinks} />
      {children}
    </div>
  );
};

export default DashBoardLayout;
