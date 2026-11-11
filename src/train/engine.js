import { motionValue } from "framer-motion";
import { clamp } from "./world.js";

// The train. Input never moves the scene directly: it only moves a target down the line, and the
// train chases it like something heavy. It pulls away gently (acceleration is capped), cruises at a
// top speed, and brakes on a critically damped spring so it settles without rolling back.

const OMEGA = 3.7; // spring stiffness: higher = snappier
const PULL = 3000; // max acceleration when speeding up, units/s²
const TOP = 2500; // top speed, units/s

export class Engine {
  constructor() {
    this.pos = motionValue(0); // world units travelled
    this.vel = motionValue(0); // units/s
    this.acc = motionValue(0); // -1..1, for things that sway
    this.p = 0;
    this.v = 0;
    this.target = 0;
    this.max = 0;
    this.calm = false;
    this.raf = 0;
    this.last = 0;
    this.waiters = [];
    this.onSettle = null;
    this.onDepart = null;
    this.moving = false;
  }

  configure(options) {
    Object.assign(this, options);
  }

  // A shove that only the hanging things feel: buffers, or the tug of setting off.
  jolt(dir) {
    if (this.calm) return;
    this.acc.set(dir);
    setTimeout(() => {
      if (!this.raf) this.acc.set(0);
    }, 150);
  }

  // Nudge the target by `d` units. Returns how far past either end of the line the push went.
  push(d) {
    const want = this.target + d;
    this.target = clamp(want, 0, this.max);
    this.wake();
    return want - this.target;
  }

  // Ride to a point on the line; resolves once the train has settled there.
  rideTo(x) {
    this.target = clamp(x, 0, this.max);
    if (Math.abs(this.target - this.p) < 2.5 && Math.abs(this.v) < 20) {
      this.wake();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.waiters.push(resolve);
      this.wake();
    });
  }

  jump(x) {
    this.target = this.p = clamp(x, 0, this.max);
    this.v = 0;
    this.pos.set(this.p);
    this.vel.set(0);
    this.acc.set(0);
    this.settle();
  }

  wake() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  arrive() {
    const w = this.waiters;
    this.waiters = [];
    w.forEach((fn) => fn());
  }

  settle() {
    this.moving = false;
    this.arrive();
    this.onSettle?.(this.p);
  }

  tick = (now) => {
    const dt = Math.min(0.034, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    const gap = this.target - this.p;

    if (this.calm) {
      // reduced motion: glide straight there, no sway
      this.p += gap * (1 - Math.exp(-dt * 12));
      this.v = 0;
    } else {
      let a = OMEGA * OMEGA * gap - 2 * OMEGA * this.v;
      if (a * this.v >= 0) a = clamp(a, -PULL, PULL); // gentle pulling away, firm brakes
      this.v = clamp(this.v + a * dt, -TOP, TOP);
      this.p += this.v * dt;
      this.acc.set(clamp(a / PULL, -1.4, 1.4));
    }

    if (!this.moving) {
      this.moving = true;
      this.onDepart?.();
    }

    // near enough that nobody can tell: let whoever is waiting get on with it while the last
    // couple of units creep in
    if (this.waiters.length && Math.abs(this.target - this.p) < 2.5 && Math.abs(this.v) < 20) this.arrive();

    if (Math.abs(this.target - this.p) < 0.4 && Math.abs(this.v) < 3) {
      this.p = this.target;
      this.v = 0;
      this.raf = 0;
      this.pos.set(this.p);
      this.vel.set(0);
      this.acc.set(0);
      this.settle();
      return;
    }
    this.pos.set(this.p);
    this.vel.set(this.v);
    this.raf = requestAnimationFrame(this.tick);
  };

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
