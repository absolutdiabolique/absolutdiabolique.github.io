const ef = editorFront, eb = editorBack;
const pf = previewFront, pb = previewBack;
let rotX = 0, rotY = 0, flipped = false;
let mathOn = false;

fontSelect.onchange = e =>
  [ef, eb].forEach(x => x.style.fontFamily = e.target.value);

increase.onclick = () =>
  [ef, eb].forEach(x =>
    x.style.fontSize = parseInt(getComputedStyle(x).fontSize) + 2 + "px");

decrease.onclick = () =>
  [ef, eb].forEach(x =>
    x.style.fontSize = Math.max(
      6,
      parseInt(getComputedStyle(x).fontSize) - 2
    ) + "px");

flip.onclick = () => {
  flipped = !flipped;
  taContainer.style.transform =
    `rotateX(${rotX}deg) rotateY(${rotY + (flipped ? 180 : 0)}deg)`;
};

reset.onclick = () => {
  rotX = rotY = 0;
  flipped = false;
  taContainer.style.transform = "rotateX(0) rotateY(0)";
};

save.onclick = () => {
  localStorage.setItem("df", ef.value);
  localStorage.setItem("db", eb.value);
};

toggleMath.onclick = () => {
  mathOn = !mathOn;
  [pf, pb].forEach(p => p.style.display = mathOn ? "block" : "none");
  updateMath();
};

function updateMath() {
  if (!mathOn) return;
  pf.textContent = ef.value;
  pb.textContent = eb.value;
  MathJax.typesetPromise([pf, pb]);
}
ef.oninput = eb.oninput = updateMath;

let drag = false, px = 0, py = 0;
taContainer.onmousedown = e => {
  drag = true; px = e.clientX; py = e.clientY;
};
onmouseup = () => drag = false;
onmousemove = e => {
  if (!drag) return;
  rotY += (e.clientX - px) * 0.5;
  rotX -= (e.clientY - py) * 0.5;
  taContainer.style.transform =
    `rotateX(${rotX}deg) rotateY(${rotY + (flipped ? 180 : 0)}deg)`;
  px = e.clientX; py = e.clientY;
};

expandToggle.onclick = () => {
  const open = expandPanel.style.display === "block";
  expandPanel.style.display = open ? "none" : "block";
  expandToggle.textContent = open ? "More ▼" : "More ▲";
};

function dl(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text]));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

dlFront.onclick = () => dl("front.txt", ef.value);
dlBack.onclick  = () => dl("back.txt", eb.value);

dlZip.onclick = async () => {
  const z = new JSZip();
  z.file("front.txt", ef.value);
  z.file("back.txt", eb.value);
  const b = await z.generateAsync({ type: "blob" });
  dl("texts.zip", b);
};

window.onload = () => {
  ef.value = localStorage.getItem("df") || "";
  eb.value = localStorage.getItem("db") || "";
};
