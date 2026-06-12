
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let loadedImage = null;

  function drawCanvas() {
    if (!loadedImage) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(loadedImage, 0, 0, w, h);

    const url = document.getElementById('url-input').value.trim();
    if (!url) return;

    const pos = document.getElementById('position').value;
    const st = document.getElementById('style').value;
    const fs = parseInt(document.getElementById('fontsize').value);
    const barH = fs + 40;

    let y = pos === 'top' ? 0 : pos === 'center' ? Math.floor(h / 2 - barH / 2) : h - barH;

    ctx.fillStyle = st === 'dark' ? 'rgba(0,0,0,0.82)' : st === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.48)';
    ctx.fillRect(0, y, w, barH);

    ctx.font = `${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = st === 'light' ? '#111111' : '#ffffff';
    ctx.fillText(url, w / 2, y + barH / 2);

    document.getElementById('download-btn').disabled = false;
    document.getElementById('hint').textContent = 'Ready — download and post on X';
  }

  document.getElementById('file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('upload-label').textContent = file.name;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        const aspect = img.width / img.height;
        if (aspect > 16 / 9) {
          canvas.width = 1200;
          canvas.height = Math.round(1200 / aspect);
        } else {
          canvas.height = 675;
          canvas.width = Math.round(675 * aspect);
        }
        drawCanvas();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  ['url-input', 'position', 'style', 'fontsize'].forEach(id => {
    document.getElementById(id).addEventListener('input', drawCanvas);
  });

  function downloadImage() {
    const link = document.createElement('a');
    link.download = 'x-post-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
