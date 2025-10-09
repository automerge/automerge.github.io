const html = document.querySelector("html");
const toggle = document.querySelector("#theme-toggle")

let theme = localStorage.getItem("theme")

const setTheme = (t) => {
  theme = t
  localStorage.setItem("theme", theme);
  html.setAttribute("theme", theme);
}

toggle.onclick = ()=> setTheme(theme == "light" ? "dark" : "light")
if (theme) setTheme(theme)
