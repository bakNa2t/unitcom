import { useState } from "react";

export const CallContent = () => {
  const [meetingCode, setMeetingCode] = useState("");

  return (
    <div className="grid md:grid-cols-2 p-2 md:p-10 gap-10 w-full place-content-center">
      <div>Call Content</div>
      <div>Call Content</div>
    </div>
  );
};
