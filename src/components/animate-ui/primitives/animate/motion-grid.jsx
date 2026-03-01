'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { getStrictContext } from '@/lib/get-strict-context';
import { Slot } from '@/components/animate-ui/primitives/animate/slot';

const [MotionGridProvider, useMotionGrid] =
  getStrictContext('MotionGridContext');

const MotionGrid = ({
  gridSize,
  frames,
  duration = 200,
  animate = true,
  asChild = false,
  style,
  ...props
}) => {
  const [index, setIndex] = React.useState(0);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (!animate || frames.length === 0) return;
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % frames.length), duration);
    return () => clearInterval(intervalRef.current);
  }, [frames.length, duration, animate]);

  const [cols, rows] = gridSize;

  const Component = asChild ? Slot : motion.div;

  return (
    <MotionGridProvider value={{ animate, index, cols, rows, frames, duration }}>
      <Component
        data-animate={animate}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: '1fr',
          ...style,
        }}
        {...props} />
    </MotionGridProvider>
  );
};

function MotionGridCells({
  activeProps,
  inactiveProps,
  ...props
}) {
  const { animate, index, cols, rows, frames, duration } = useMotionGrid();

  const active = new Set(frames[index]?.map(([x, y]) => y * cols + x) ?? []);

  return Array.from({ length: cols * rows }).map((_, i) => {
    const isActive = active.has(i);
    const componentProps = {
      ...(isActive ? activeProps : inactiveProps),
    };
    componentProps.className = cn(
      props?.className,
      isActive ? activeProps?.className : inactiveProps?.className
    );
    componentProps.style = {
      ...props?.style,
      ...(isActive ? activeProps?.style : inactiveProps?.style),
    };

    return (
      <motion.div
        key={i}
        data-active={isActive}
        data-animate={animate}
        transition={{ duration, ease: 'easeInOut' }}
        {...props}
        {...componentProps} />
    );
  });
}

export { MotionGrid, MotionGridCells };
