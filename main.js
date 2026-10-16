const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const aInput = document.getElementById("a-value");
const bInput = document.getElementById("b-value");
const plainInput = document.getElementById("plain-input");
const cipherInput = document.getElementById("cipher-input");
const cipherOutput = document.getElementById("cipher-output");
const plainOutput = document.getElementById("plain-output");
const formulaOutput = document.getElementById("formula");
const statusMessage = document.getElementById("status-message");
const codeSnippet = document.getElementById("code-snippet");

function mod1to26(value) {
  return (((value - 1) % 26) + 26) % 26 + 1;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function modularInverse(value, mod = 26) {
  const normalized = ((value % mod) + mod) % mod;
  for (let i = 1; i < mod; i += 1) {
    if ((normalized * i) % mod === 1) {
      return i;
    }
  }
  return null;
}

function transformText(text, transformFn) {
  return [...text]
    .map((char) => {
      const upper = char.toUpperCase();
      const index = alphabet.indexOf(upper);
      if (index === -1) {
        return char;
      }
      const mapped = transformFn(index + 1);
      return alphabet[mapped - 1];
    })
    .join("");
}

function encode(plaintext, a, b) {
  return transformText(plaintext, (x) => mod1to26(a * x + b));
}

function decode(ciphertext, a, b) {
  const inverse = modularInverse(a, 26);
  if (inverse === null) {
    return null;
  }
  return transformText(ciphertext, (y) => mod1to26(inverse * (y - b)));
}

function renderCodeSnippet() {
  codeSnippet.textContent = `// A=1, B=2, ..., Z=26
function encodeLetter(x, a, b) {
  return (((a * x + b - 1) % 26 + 26) % 26) + 1;
}

function decodeLetter(y, a, b, aInverse) {
  return (((aInverse * (y - b) - 1) % 26 + 26) % 26) + 1;
}`;
}

function update() {
  const a = Number.parseInt(aInput.value, 10);
  const b = Number.parseInt(bInput.value, 10);
  formulaOutput.textContent = `y = (${Number.isNaN(a) ? "a" : a}x + ${
    Number.isNaN(b) ? "b" : b
  }) mod 26`;

  if (Number.isNaN(a) || Number.isNaN(b)) {
    statusMessage.textContent = "Please enter numbers for a and b.";
    cipherOutput.textContent = "";
    plainOutput.textContent = "";
    return;
  }

  if (gcd(a, 26) !== 1) {
    statusMessage.textContent = "a must be coprime with 26 so decoding works.";
    cipherOutput.textContent = encode(plainInput.value, a, b);
    plainOutput.textContent = "";
    return;
  }

  statusMessage.textContent = "";
  cipherOutput.textContent = encode(plainInput.value, a, b);
  plainOutput.textContent = decode(cipherInput.value, a, b) || "";
}

renderCodeSnippet();
update();

[aInput, bInput, plainInput, cipherInput].forEach((element) => {
  element.addEventListener("input", update);
});
