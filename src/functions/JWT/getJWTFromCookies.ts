// functions/JWT/getJWTFromCookies.ts
export function getJwtFromCookies(cookieName = 'Troquero-Token'): string | null {
  // Verificar si estamos en el lado del cliente
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    console.warn('Se intentó acceder a cookies en el servidor o entorno sin document');
    return null;
  }

  // Debug: Mostrar todas las cookies disponibles
  console.log('Cookies disponibles:', document.cookie);

  try {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      // Comparación exacta del nombre (case-sensitive)
      if (name.trim() === cookieName) {
        return decodeURIComponent(value);
      }
    }
    console.warn(`Cookie "${cookieName}" no encontrada`);
    return null;
  } catch (error) {
    console.error('Error al leer cookies:', error);
    return null;
  }
}

export function decodeJwt(token: string): any | null {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) {
      throw new Error('Formato JWT inválido: falta payload');
    }

    // Decodificación segura Base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    
    // Convertir a objeto JSON
    const decoded = JSON.parse(jsonPayload);
    
    // Verificar campos mínimos
    if (!decoded.id_usuario || !decoded.rol) {
      console.warn('JWT no contiene los campos esperados');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}