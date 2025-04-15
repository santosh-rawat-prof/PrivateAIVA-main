import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../utilities/cn"; // Optional utility

export default function InfiniteMovingCards({
  items,
  direction = "up",
  speed = "normal",
  pauseOnHover = true,
  className,
}) {
  const controls = useAnimation();
  const containerRef = useRef(null);

  const duration = speed === "slow" ? 30 : speed === "fast" ? 10 : 20;
  const dirMultiplier = direction === "down" ? 1 : -1;

  const animateLoop = () => {
    controls.start({
      y: ["0%", `${dirMultiplier * -100}%`],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration,
        },
      },
    });
  };

  useEffect(() => {
    animateLoop();
  }, [direction, speed]);

  return (
    <div
      className={cn("relative overflow-hidden h-screen p-4", className)}
      onMouseEnter={() => pauseOnHover && controls.stop()}
      onMouseLeave={() => pauseOnHover && animateLoop()}
    >
      <motion.div
        ref={containerRef}
        animate={controls}
        className="flex flex-col"
        style={{
          willChange: "transform",
        }}
      >
        {/* Duplicate the full list once */}
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-700 text-white shadow-md p-4 m-2 rounded-md w-72 mx-auto"
          >
            <p className="text-xs font-semibold">{item.title}</p>
            <p className="text-xs mt-2">{item.message}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
