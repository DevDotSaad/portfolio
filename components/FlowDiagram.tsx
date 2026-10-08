import type { Diagram } from '@/lib/data';

const pad2 = (n: number) => String(n).padStart(2, '0');

function Arrow({ x, y, dir }: { x: number; y: number; dir: 'right' | 'down' | 'up' | 'left' }) {
  const d = {
    right: `M${x - 7},${y - 5} L${x},${y} L${x - 7},${y + 5}Z`,
    left: `M${x + 7},${y - 5} L${x},${y} L${x + 7},${y + 5}Z`,
    down: `M${x - 5},${y - 7} L${x},${y} L${x + 5},${y - 7}Z`,
    up: `M${x - 5},${y + 7} L${x},${y} L${x + 5},${y + 7}Z`,
  }[dir];
  return <path className="d-arrow" d={d} />;
}

function Node({ x, y, w, h, step, title, sub, branch }: { x: number; y: number; w: number; h: number; step?: string; title: string; sub?: string; branch?: boolean }) {
  return (
    <g className={`d-node${branch ? ' is-branch' : ''}`}>
      <rect x={x} y={y} width={w} height={h} rx={14} />
      {step ? (
        <text className="d-step" x={x + 16} y={y + 22}>
          {step}
        </text>
      ) : null}
      <text className="d-title" x={x + 16} y={y + (step ? 46 : 32)}>
        {title}
      </text>
      {sub ? (
        <text className="d-sub" x={x + 16} y={y + (step ? 66 : 52)}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** Architecture / flow diagram: horizontal on wide screens, vertical on phones. */
export default function FlowDiagram({ diagram }: { diagram: Diagram }) {
  const { nodes, branch } = diagram;
  const n = nodes.length;

  // Horizontal geometry
  const W = 176, H = 84, G = 44, P = 16;
  const hw = P * 2 + n * W + (n - 1) * G;
  const BW = 296, BH = 66, BG = 54;
  const hh = P * 2 + H + (branch ? BG + BH : 0);
  const nx = (i: number) => P + i * (W + G);

  // Vertical geometry
  const VW = 250, VH = 80, VG = 34, lane = 292;
  const vNodeY = (i: number) => P + i * (VH + VG);
  const vBranchY = vNodeY(n) + 10;
  const vh = vBranchY + (branch ? BH : -VG - 10) + P;

  return (
    <figure className="diagram glass" data-spotlight="" data-inview="">
      {/* Horizontal */}
      <svg className="d-horiz" viewBox={`0 0 ${hw} ${hh}`} role="img" aria-labelledby="diagram-title">
        <title id="diagram-title">{diagram.label}</title>
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = nx(i) + W, x2 = nx(i + 1), y = P + H / 2;
          return (
            <g key={`e${i}`}>
              <path className="d-edge" d={`M${x1},${y} H${x2 - 2}`} />
              <path className="d-flow" d={`M${x1 + 4},${y} H${x2 - 10}`} />
              <Arrow x={x2 - 2} y={y} dir="right" />
            </g>
          );
        })}
        {nodes.map((node, i) => (
          <Node key={i} x={nx(i)} y={P} w={W} h={H} step={pad2(i + 1)} title={node.title} sub={node.sub} />
        ))}
        {branch ? (() => {
          const cx = nx(branch.at) + W / 2;
          const bx = Math.min(Math.max(cx - BW / 2, P), hw - P - BW);
          const by = P + H + BG;
          const top = P + H;
          return (
            <g>
              <path className="d-edge" d={`M${cx},${top + 2} V${by - 2}`} />
              <path className="d-flow" d={branch.direction === 'in' ? `M${cx},${by - 6} V${top + 10}` : `M${cx},${top + 6} V${by - 10}`} />
              {branch.direction === 'in' ? <Arrow x={cx} y={top + 2} dir="up" /> : <Arrow x={cx} y={by - 2} dir="down" />}
              <Node x={bx} y={by} w={BW} h={BH} title={branch.title} sub={branch.sub} branch />
            </g>
          );
        })() : null}
      </svg>

      {/* Vertical */}
      <svg className="d-vert" viewBox={`0 0 ${lane + 16} ${vh}`} role="img" aria-label={diagram.label}>
        {nodes.slice(0, -1).map((_, i) => {
          const x = P + VW / 2, y1 = vNodeY(i) + VH, y2 = vNodeY(i + 1);
          return (
            <g key={`ve${i}`}>
              <path className="d-edge" d={`M${x},${y1} V${y2 - 2}`} />
              <path className="d-flow" d={`M${x},${y1 + 4} V${y2 - 10}`} />
              <Arrow x={x} y={y2 - 2} dir="down" />
            </g>
          );
        })}
        {nodes.map((node, i) => (
          <Node key={i} x={P} y={vNodeY(i)} w={VW} h={VH} step={pad2(i + 1)} title={node.title} sub={node.sub} />
        ))}
        {branch ? (() => {
          const ay = vNodeY(branch.at) + VH / 2;
          const by = vBranchY + BH / 2;
          const right = P + VW;
          const d = `M${right + 2},${ay} H${lane - 12} Q${lane},${ay} ${lane},${ay + 12} V${by - 12} Q${lane},${by} ${lane - 12},${by} H${right + 2}`;
          return (
            <g>
              <path className="d-edge" d={d} />
              {branch.direction === 'in' ? <Arrow x={right + 2} y={ay} dir="left" /> : <Arrow x={right + 2} y={by} dir="left" />}
              <Node x={P} y={vBranchY} w={VW} h={BH} title={branch.title} sub={branch.sub} branch />
            </g>
          );
        })() : null}
      </svg>

      <figcaption className="sr-only">
        <ol>
          {nodes.map((node, i) => (
            <li key={i}>
              {node.title}
              {node.sub ? ` — ${node.sub}` : ''}
            </li>
          ))}
        </ol>
        {branch ? <p>{`${branch.title} (${branch.sub}) ${branch.direction === 'in' ? 'feeds' : 'comes from'} ${nodes[branch.at].title}.`}</p> : null}
      </figcaption>
    </figure>
  );
}
