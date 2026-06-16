// LLM Knowledge Graph — render a topic as an interactive force-directed graph.
// Curated graphs ship in-page so the demo always works; "Generate your own"
// calls an LLM live (bring-your-own-key) to extract entities & relations.

const REPO_URL = "https://github.com/tongchen2010/llm-knowledge-graph";

// ---------- curated graphs ----------
const GRAPHS = {
  "Graph Neural Networks": {
    nodes: [
      { id: "gnn", label: "Graph Neural Network", type: "field" },
      { id: "graph", label: "Graph", type: "concept" },
      { id: "node", label: "Node", type: "concept" },
      { id: "edge", label: "Edge", type: "concept" },
      { id: "adj", label: "Adjacency Matrix", type: "concept" },
      { id: "mp", label: "Message Passing", type: "method" },
      { id: "agg", label: "Aggregation", type: "method" },
      { id: "emb", label: "Node Embedding", type: "concept" },
      { id: "gcn", label: "GCN", type: "method" },
      { id: "gat", label: "GAT", type: "method" },
      { id: "sage", label: "GraphSAGE", type: "method" },
      { id: "nodeclf", label: "Node Classification", type: "task" },
      { id: "linkpred", label: "Link Prediction", type: "task" },
      { id: "pyg", label: "PyTorch Geometric", type: "library" },
    ],
    links: [
      { source: "gnn", target: "graph", relation: "operates on" },
      { source: "graph", target: "node", relation: "has" },
      { source: "graph", target: "edge", relation: "has" },
      { source: "graph", target: "adj", relation: "represented by" },
      { source: "gnn", target: "mp", relation: "uses" },
      { source: "mp", target: "agg", relation: "uses" },
      { source: "mp", target: "emb", relation: "produces" },
      { source: "gcn", target: "gnn", relation: "is a" },
      { source: "gat", target: "gnn", relation: "is a" },
      { source: "sage", target: "gnn", relation: "is a" },
      { source: "gat", target: "agg", relation: "via attention" },
      { source: "emb", target: "nodeclf", relation: "enables" },
      { source: "emb", target: "linkpred", relation: "enables" },
      { source: "pyg", target: "gnn", relation: "implements" },
    ],
  },
  "Machine Learning": {
    nodes: [
      { id: "ml", label: "Machine Learning", type: "field" },
      { id: "sup", label: "Supervised", type: "concept" },
      { id: "unsup", label: "Unsupervised", type: "concept" },
      { id: "rl", label: "Reinforcement", type: "concept" },
      { id: "clf", label: "Classification", type: "task" },
      { id: "reg", label: "Regression", type: "task" },
      { id: "clu", label: "Clustering", type: "task" },
      { id: "nn", label: "Neural Network", type: "method" },
      { id: "svm", label: "SVM", type: "method" },
      { id: "dl", label: "Deep Learning", type: "field" },
      { id: "gd", label: "Gradient Descent", type: "method" },
      { id: "loss", label: "Loss Function", type: "concept" },
      { id: "of", label: "Overfitting", type: "concept" },
      { id: "regz", label: "Regularization", type: "method" },
    ],
    links: [
      { source: "ml", target: "sup", relation: "includes" },
      { source: "ml", target: "unsup", relation: "includes" },
      { source: "ml", target: "rl", relation: "includes" },
      { source: "sup", target: "clf", relation: "includes" },
      { source: "sup", target: "reg", relation: "includes" },
      { source: "unsup", target: "clu", relation: "includes" },
      { source: "clf", target: "nn", relation: "uses" },
      { source: "clf", target: "svm", relation: "uses" },
      { source: "dl", target: "ml", relation: "subfield of" },
      { source: "dl", target: "nn", relation: "uses" },
      { source: "nn", target: "gd", relation: "trained by" },
      { source: "gd", target: "loss", relation: "minimizes" },
      { source: "of", target: "regz", relation: "reduced by" },
      { source: "nn", target: "of", relation: "prone to" },
    ],
  },
  "The Solar System": {
    nodes: [
      { id: "sun", label: "Sun", type: "star" },
      { id: "mercury", label: "Mercury", type: "planet" },
      { id: "venus", label: "Venus", type: "planet" },
      { id: "earth", label: "Earth", type: "planet" },
      { id: "mars", label: "Mars", type: "planet" },
      { id: "jupiter", label: "Jupiter", type: "planet" },
      { id: "saturn", label: "Saturn", type: "planet" },
      { id: "uranus", label: "Uranus", type: "planet" },
      { id: "neptune", label: "Neptune", type: "planet" },
      { id: "moon", label: "The Moon", type: "moon" },
      { id: "belt", label: "Asteroid Belt", type: "region" },
      { id: "gravity", label: "Gravity", type: "concept" },
    ],
    links: [
      { source: "sun", target: "mercury", relation: "orbited by" },
      { source: "sun", target: "venus", relation: "orbited by" },
      { source: "sun", target: "earth", relation: "orbited by" },
      { source: "sun", target: "mars", relation: "orbited by" },
      { source: "sun", target: "jupiter", relation: "orbited by" },
      { source: "sun", target: "saturn", relation: "orbited by" },
      { source: "sun", target: "uranus", relation: "orbited by" },
      { source: "sun", target: "neptune", relation: "orbited by" },
      { source: "earth", target: "moon", relation: "orbited by" },
      { source: "belt", target: "mars", relation: "beyond" },
      { source: "belt", target: "jupiter", relation: "before" },
      { source: "gravity", target: "sun", relation: "governs orbits of" },
    ],
  },
  "Photosynthesis": {
    nodes: [
      { id: "ps", label: "Photosynthesis", type: "process" },
      { id: "chloroplast", label: "Chloroplast", type: "structure" },
      { id: "chlorophyll", label: "Chlorophyll", type: "molecule" },
      { id: "light", label: "Light", type: "input" },
      { id: "water", label: "Water", type: "input" },
      { id: "co2", label: "Carbon Dioxide", type: "input" },
      { id: "glucose", label: "Glucose", type: "output" },
      { id: "oxygen", label: "Oxygen", type: "output" },
      { id: "lr", label: "Light Reactions", type: "stage" },
      { id: "calvin", label: "Calvin Cycle", type: "stage" },
      { id: "atp", label: "ATP", type: "molecule" },
    ],
    links: [
      { source: "ps", target: "chloroplast", relation: "occurs in" },
      { source: "chloroplast", target: "chlorophyll", relation: "contains" },
      { source: "chlorophyll", target: "light", relation: "absorbs" },
      { source: "ps", target: "water", relation: "consumes" },
      { source: "ps", target: "co2", relation: "consumes" },
      { source: "ps", target: "glucose", relation: "produces" },
      { source: "ps", target: "oxygen", relation: "produces" },
      { source: "ps", target: "lr", relation: "has stage" },
      { source: "ps", target: "calvin", relation: "has stage" },
      { source: "lr", target: "atp", relation: "produces" },
      { source: "calvin", target: "atp", relation: "consumes" },
      { source: "calvin", target: "glucose", relation: "builds" },
    ],
  },
};

const PALETTE = ["#6ea8fe", "#8b7cff", "#3fb950", "#d29922", "#e8833a", "#e06c9f", "#56c7c7", "#b58cff"];

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const topicSel = $("topic"), svgEl = $("graph"), legendEl = $("legend"),
  infoEl = $("info"), liveTopic = $("live-topic"), liveKey = $("live-key"),
  genBtn = $("gen-btn"), statusEl = $("status");
$("repo-link").href = REPO_URL;

let d3 = null, sim = null;

// ---------- boot ----------
init();
async function init() {
  Object.keys(GRAPHS).forEach((k) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = k; topicSel.appendChild(o);
  });
  try {
    d3 = await import("https://cdn.jsdelivr.net/npm/d3@7/+esm");
  } catch (e) {
    svgEl.outerHTML = `<div style="padding:40px;text-align:center;color:#f85149">Couldn't load D3 (are you online?)</div>`;
    return;
  }
  topicSel.addEventListener("change", () => render(GRAPHS[topicSel.value]));
  genBtn.addEventListener("click", generate);
  render(GRAPHS[topicSel.value]);
}

// ---------- rendering ----------
function render(graph) {
  if (sim) sim.stop();
  const svg = d3.select(svgEl);
  svg.selectAll("*").remove();
  infoEl.hidden = true;

  const w = svgEl.clientWidth || 880, h = svgEl.clientHeight || 540;

  // clone so curated data is never mutated by the force layout
  const nodes = graph.nodes.map((d) => ({ ...d }));
  const links = graph.links.map((d) => ({ ...d }));

  // color per type
  const types = [...new Set(nodes.map((n) => n.type || "concept"))];
  const colorOf = (t) => PALETTE[types.indexOf(t || "concept") % PALETTE.length];

  // degree -> radius
  const deg = {};
  links.forEach((l) => { deg[l.source] = (deg[l.source] || 0) + 1; deg[l.target] = (deg[l.target] || 0) + 1; });
  nodes.forEach((n) => (n.r = 7 + Math.min(deg[n.id] || 0, 6) * 2));

  const g = svg.append("g");
  const zoom = d3.zoom().scaleExtent([0.3, 3]).on("zoom", (e) => g.attr("transform", e.transform));
  svg.call(zoom).on("dblclick.zoom", null);

  const link = g.append("g").selectAll("line").data(links).join("line").attr("class", "link");
  const linkLabel = g.append("g").selectAll("text").data(links).join("text")
    .attr("class", "link-label").attr("text-anchor", "middle").text((d) => d.relation || "");

  const node = g.append("g").selectAll("g").data(nodes).join("g").attr("class", "node");
  node.append("circle").attr("r", (d) => d.r).attr("fill", (d) => colorOf(d.type));
  node.append("text").attr("x", (d) => d.r + 4).attr("dy", "0.32em").text((d) => d.label);

  node.call(d3.drag()
    .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  node.on("click", (e, d) => { e.stopPropagation(); focus(d, nodes, links, node, link, linkLabel); });
  svg.on("click", () => clearFocus(node, link, linkLabel));

  buildLegend(types, colorOf);

  sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(78).strength(0.45))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(w / 2, h / 2))
    .force("collide", d3.forceCollide().radius((d) => d.r + 10))
    .on("tick", () => {
      link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      linkLabel.attr("x", (d) => (d.source.x + d.target.x) / 2).attr("y", (d) => (d.source.y + d.target.y) / 2);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
}

function focus(d, nodes, links, node, link, linkLabel) {
  const nbr = new Set([d.id]);
  links.forEach((l) => {
    const s = l.source.id || l.source, t = l.target.id || l.target;
    if (s === d.id) nbr.add(t);
    if (t === d.id) nbr.add(s);
  });
  node.classed("dim", (n) => !nbr.has(n.id));
  link.classed("dim", (l) => (l.source.id !== d.id && l.target.id !== d.id));
  // show relation labels only for the focused node's edges; leave the rest hidden
  linkLabel.classed("faded-label", (l) => (l.source.id === d.id || l.target.id === d.id));

  const rels = links
    .filter((l) => l.source.id === d.id || l.target.id === d.id)
    .map((l) => l.source.id === d.id
      ? `<b>${esc(d.label)}</b> ${esc(l.relation || "→")} ${esc(l.target.label)}`
      : `<b>${esc(l.source.label)}</b> ${esc(l.relation || "→")} ${esc(d.label)}`);
  infoEl.hidden = false;
  infoEl.innerHTML = `<h3>${esc(d.label)}</h3>` +
    (rels.length ? rels.map((r) => `<p class="rel">${r}</p>`).join("") : `<p class="rel">No connections.</p>`);
}

function clearFocus(node, link, linkLabel) {
  node.classed("dim", false);
  link.classed("dim", false);
  linkLabel.classed("faded-label", false).classed("dim", false);
  infoEl.hidden = true;
}

function buildLegend(types, colorOf) {
  legendEl.innerHTML = types.map((t) =>
    `<div class="row"><i style="background:${colorOf(t)}"></i>${esc(t)}</div>`).join("");
}

// ---------- live generation (bring your own key) ----------
async function generate() {
  const topic = liveTopic.value.trim(), key = liveKey.value.trim();
  if (!topic) return setStatus("Enter a topic first.", "err");
  if (!key) return setStatus("Enter your OpenAI API key.", "err");
  setStatus("Calling the model…", "busy");
  genBtn.disabled = true;
  try {
    const sys = "You build concept knowledge graphs. Return ONLY JSON: {\"nodes\":[{\"id\",\"label\",\"type\"}],\"links\":[{\"source\",\"target\",\"relation\"}]}. Use 10-16 nodes. 'type' is a short lowercase category. Every link source/target MUST be an existing node id.";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", temperature: 0.3, response_format: { type: "json_object" },
        messages: [{ role: "system", content: sys }, { role: "user", content: `Topic: "${topic}".` }],
      }),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 100)}`);
    const data = await res.json();
    const g = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    if (!Array.isArray(g.nodes) || !Array.isArray(g.links)) throw new Error("Unexpected response shape");
    const ids = new Set(g.nodes.map((n) => n.id));
    g.links = g.links.filter((l) => ids.has(l.source) && ids.has(l.target));
    if (!g.nodes.length) throw new Error("No nodes returned");
    setStatus(`Generated ${g.nodes.length} nodes, ${g.links.length} links.`, "ok");
    render(g);
  } catch (err) {
    setStatus(String(err.message || err), "err");
  } finally {
    genBtn.disabled = false;
  }
}

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = "status " + (kind || "");
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
