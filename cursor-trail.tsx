"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; age: number; radius: number };

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const ctx = context;
    const pointer = { x: -100, y: -100, targetX: -100, targetY: -100, active: false };
    const particles: Particle[] = [];
    let frame = 0;
    let previousX = -100;
    let previousY = -100;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      const distance = Math.hypot(dx, dy);
      const steps = Math.min(Math.ceil(distance / 9), 18);
      for (let index = 0; index < steps; index += 1) {
        const progress = (index + 1) / steps;
        particles.push({
          x: previousX + dx * progress,
          y: previousY + dy * progress,
          age: 0,
          radius: 2 + Math.random() * 2.2,
        });
      }
      previousX = event.clientX;
      previousY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const onLeave = () => { pointer.active = false; };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.24;
      pointer.y += (pointer.targetY - pointer.y) * 0.24;

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.age += 1 / 60;
        if (particle.age > 0.52) particles.splice(index, 1);
      }

      if (particles.length > 1) {
        ctx.beginPath();
        ctx.moveTo(particles[0].x, particles[0].y);
        for (let index = 1; index < particles.length; index += 1) {
          ctx.lineTo(particles[index].x, particles[index].y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.46)";
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      for (const particle of particles) {
        const opacity = 1 - particle.age / 0.52;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.82})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity})`;
        ctx.shadowBlur = 13;
        ctx.arc(particle.x, particle.y, particle.radius * opacity, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(179, 239, 121, 0.55)";
        ctx.shadowBlur = 14;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame = pointer.active || particles.length ? window.requestAnimationFrame(draw) : 0;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.classList.add("has-cursor-trail");
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.classList.remove("has-cursor-trail");
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
