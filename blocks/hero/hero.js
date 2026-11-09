export default function decorate(block) {
  const rows = [...block.children];
  const slides = document.createElement('div');
  slides.className = 'hero-slides';
  rows.forEach((row, i) => {
    const [pic, text] = [...row.children];
    row.className = 'hero-slide';
    row.setAttribute('aria-label', `${i + 1} / ${rows.length}`);
    pic.className = 'hero-image';
    text.className = 'hero-text';
    slides.append(row);
  });
  block.append(slides);
  if (rows.length < 2) return;
  let current = 0;
  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  const go = (n) => {
    current = (n + rows.length) % rows.length;
    slides.style.transform = `translateX(-${current * 100}%)`;
    [...dots.children].forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
  };
  rows.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dots.append(d);
  });
  block.append(dots);
  go(0);
  setInterval(() => go(current + 1), 6000);
}
