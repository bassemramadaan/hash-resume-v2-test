import { useRef, TouchEvent } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minDeltaX?: number; // Minimum horizontal distance in px (default 55)
  maxDurationMs?: number; // Maximum swipe time in ms (default 500)
  verticalRatio?: number; // Horizontal to vertical ratio threshold (default 1.5)
  enableHaptics?: boolean; // Trigger subtle vibration on mobile (default true)
  disabled?: boolean;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  minDeltaX = 55,
  maxDurationMs = 500,
  verticalRatio = 1.5,
  enableHaptics = true,
  disabled = false,
}: SwipeGestureOptions) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    // Only track single-touch gestures (ignore multi-touch pinch/zoom)
    if (e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const target = e.target as HTMLElement | null;

    // Safety checks: Never intercept text typing, buttons, or scrollable chip rows
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[contenteditable="true"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[role="slider"]') ||
        target.closest('.no-swipe') ||
        target.closest('.overflow-x-auto'))
    ) {
      touchStartRef.current = null;
      return;
    }

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    if (e.changedTouches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    // Must be within time threshold and horizontal distance must dominate vertical scroll
    if (
      elapsed <= maxDurationMs &&
      Math.abs(diffX) >= minDeltaX &&
      Math.abs(diffX) > Math.abs(diffY) * verticalRatio
    ) {
      const triggerHaptic = () => {
        if (enableHaptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(10);
          } catch (_) {
            // Ignore vibration permission or unsupported errors
          }
        }
      };

      if (diffX < 0) {
        // Swiped Left (finger moved leftward <-)
        if (onSwipeLeft) {
          e.stopPropagation();
          triggerHaptic();
          onSwipeLeft();
        }
      } else {
        // Swiped Right (finger moved rightward ->)
        if (onSwipeRight) {
          e.stopPropagation();
          triggerHaptic();
          onSwipeRight();
        }
      }
    }
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
};
