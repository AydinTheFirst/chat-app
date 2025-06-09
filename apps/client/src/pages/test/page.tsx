import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

export default function App() {
  // The scrollable element for your list
  const parentRef = React.useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    estimateSize: () => 35,
    getScrollElement: () => parentRef.current
  });

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: "auto" // Make it scroll!
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
            width: "100%"
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                height: `${virtualItem.size}px`,
                left: 0,
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualItem.start}px)`,
                width: "100%"
              }}
            >
              Row {virtualItem.index}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
