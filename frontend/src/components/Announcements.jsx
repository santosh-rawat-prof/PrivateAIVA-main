import React from "react";
import announcement from "../db/Announcement.json";
import InfiniteMovingCards from "./InfiniteMovingCards";

function Announcements() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <InfiniteMovingCards
          items={announcement}
          direction="up"
          speed="slow"
        />
      </div>
    </div>
  );
}

export default Announcements;
