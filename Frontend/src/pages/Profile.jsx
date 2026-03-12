import { UserProfile } from "@clerk/react";

export default function Profile() {
  return (
    <div className="p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <UserProfile routing="path" path="/profile" />
      </div>
    </div>
  );
}
