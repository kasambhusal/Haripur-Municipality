"use client";

import { MemberCard } from "@/components/MemberCard";

interface Member {
  id: string;
  name: string;
  position: string;
  phone: string;
  identity: string;
  email?: string;
  imageUrl: string;
  headerColor: string;
}

interface HomeMemberProps {
  members?: Member[];
  className?: string;
}

const defaultMembers: Member[] = [
  {
    id: "1",
    name: "गोपाल पजियार",
    position: "नगर प्रमुख ",
    identity: "जन प्रतिनिधि",
    phone: "9844059638",
    email: "gopalpajiyaresa@gmail.com",
    imageUrl: "/assets/images/Members/gopalpariyar.jpg",
    headerColor: "#002c58", // Light blue
  },
  {
    id: "2",
    name: "निलम देवि राय यादव",
    position: "नगर उप प्रमुख",
    phone: "9824870244",
    identity: "जन प्रतिनिधि",
    email: "dmayor.haripurmun@gmail.com",
    imageUrl: "/assets/images/Members/nelamyadav.jpeg",
    headerColor: "#002c58", // Purple
  },
  {
    id: "3",
    name: "विनय पौडेल",
    position: "प्रमुख प्रशासकीय अधिकृत ",
    phone: "9854084666",
    identity: "पदाधिकारी",
    email: "mail8haripurmun@gmail.com",
    imageUrl: "/assets/images/Members/vinay-poudel.jpg",
    headerColor: "#002c58", // Green
  },
];

export function HomeMembers({
  members = defaultMembers,
  className,
}: HomeMemberProps) {
  return (
    <div
      className={`bg-white w-full py-3 flex flex-col items-center ${className}`}
    >
      <div className=" w-8/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              position={member.position}
              identity={member.identity}
              phone={member.phone}
              email={member.email}
              imageUrl={member.imageUrl}
              headerColor={member.headerColor}
              className="bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
