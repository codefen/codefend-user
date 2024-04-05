function base64UrlDecode(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export const decodePayload: (token: string) => any = (token: string) => {
  const payloadBase64 = token.split(".")[1];

  if (!payloadBase64) {
    console.error("Token inválido");
    return null;
  }

  try {
    const decodedPayload = JSON.parse(base64UrlDecode(payloadBase64));

    return decodedPayload;
  } catch (error) {
    console.error("Error al decodificar el payload:", error);
    return null;
  }
};
