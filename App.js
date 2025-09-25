import React from "react"
import NavegacionPrincipal from "./Src/Navegacion/AppNavegacion"
import { ThemeProvider } from "./context/ThemeContext"




export default function App() {
  return (
    <ThemeProvider>
      <NavegacionPrincipal />
    </ThemeProvider>
  )
}
