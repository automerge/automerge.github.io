const setupDitherFor = (elm, img) => {
  const aspect = img.naturalHeight / img.naturalWidth
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  elm.prepend(canvas)
  let width = 0

  const render = () => {
    try {
      // const start = performance.now()
      if(getComputedStyle(elm).display == "none") return
      if(getComputedStyle(elm.parentNode).display == "none") return
      const rect = img.getBoundingClientRect()
      const newWidth = Math.round(rect.width)
      if (newWidth == width || newWidth <= 0) return
      width = newWidth
      const height = width * aspect | 0
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = canvas.width = width * dpr
      const h = canvas.height = height * dpr
      canvas.style.width = width + "px"
      ctx.drawImage(img, 0, 0, w, h)

      const imgData = ctx.getImageData(0, 0, w, h)
      const data = imgData.data

      const spread = (x, y, dx, dy, weight, err) => {
        const nx = x + dx, ny = y + dy
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) return
        const j = (ny * w + nx) * 4
        data[j] += err * weight
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          const oldV = data[i]
          const newV = oldV < 128 ? 0 : 255
          const err = oldV - newV
          data[i] = newV
          // Thanks, Bill
          spread(x, y,  1, 0, 1/8, err)
          spread(x, y,  2, 0, 1/8, err)
          spread(x, y, -1, 1, 1/8, err)
          spread(x, y,  0, 1, 1/8, err)
          spread(x, y,  1, 1, 1/8, err)
          spread(x, y,  0, 2, 1/8, err)
          data[i + 1] = data[i + 2] = data[i]
        }
      }

      ctx.putImageData(imgData, 0, 0)
      // console.log(performance.now() - start)
    } catch (e) {
      // Sometimes the dither fails. That's fine.
    }
  }

  window.addEventListener("resize", render)
  render()
}

document.querySelectorAll("[js-dither]").forEach(elm => {
  const img = elm.querySelector("img")
  if (img.complete && img.naturalWidth) setupDitherFor(elm, img)
  else img.addEventListener("load", () => setupDitherFor(elm, img), { once: true })
})