import { UserProfile } from "@clerk/react";

export default function Profile() {
  return (
    <div className="p-8 flex justify-center">
      <UserProfile routing="path" path="/profile" />
    </div>
  );
}
