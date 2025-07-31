// Extraer el código JWT de las cookies
export function getJwtFromCookies(): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  const jwtCookie = cookies.find(cookie => cookie.startsWith('tu_jwt='));
  
  if (!jwtCookie) return null;
  
  return jwtCookie.split('=')[1];
}