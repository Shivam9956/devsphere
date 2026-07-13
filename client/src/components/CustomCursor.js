import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    const onMove = e => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Check hover
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const isClickable = el.tagName === 'A' || el.tagName === 'BUTTON' ||
          el.closest('a') || el.closest('button') ||
          window.getComputedStyle(el).cursor === 'pointer';
        setHovering(!!isClickable);
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Animation loop — uses clientX/Y so scroll doesn't affect it
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  const dotSize = clicking ? 8 : 10;
  const ringSize = hovering ? 44 : 32;

  return (
    <>
      {/* Dot — follows cursor exactly */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: '#6366f1',
          pointerEvents: 'none',
          zIndex: 999999,
          marginLeft: -(dotSize / 2),
          marginTop: -(dotSize / 2),
          transition: 'width 0.15s, height 0.15s',
          willChange: 'transform'
        }}
      />
      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#8b5cf6' : '#6366f1'}`,
          pointerEvents: 'none',
          zIndex: 999998,
          marginLeft: -(ringSize / 2),
          marginTop: -(ringSize / 2),
          opacity: 0.6,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          willChange: 'transform'
        }}
      />
    </>
  );
}
