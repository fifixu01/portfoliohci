// Everything on the desk is sized in --u, which scales with the viewport (see .desk in index.css).
export const u = (n) => `calc(var(--u) * ${n})`;
