(()=> {

  const html = document.querySelector("html");

  let theme = localStorage.getItem("theme")
  theme ??= matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"

  let setTheme = (t) => {
    theme = t
    html.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("set-theme", { detail: theme }))
  }

  document.querySelector("#theme-toggle").onclick = ()=> setTheme(theme == "light" ? "dark" : "light")

  if (theme != null) setTheme(theme)

})()