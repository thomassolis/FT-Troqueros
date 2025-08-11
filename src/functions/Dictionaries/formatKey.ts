// src/utils/formatKey.ts
import { customerFieldLabels } from "./customers";
// Fallback: convierte "nombrePersonaContacto" -> "Nombre Persona Contacto"
const startCase = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, c => c.toUpperCase());

/**
 * Devuelve la etiqueta amigable según el módulo.
 * Por ahora solo aplicamos diccionario a "Customers".
 */
export const formatKey = (key: string, module?: string) => {
  if (module === "Customers") {
    return customerFieldLabels[key] ?? startCase(key);
  }
  return startCase(key);
};
