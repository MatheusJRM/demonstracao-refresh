export function getCookieData(key: string) {
  // PEGANDO DADOS DOS COOKIES
  const allCookies = document.cookie;

  // DIVIDIR PELO SPLIT NO PONTO E VÍRGULA
  const parts = allCookies.split(";");

  // ALINHAR TODOS OS CAMPOS BASEADOS EM CHAVE E VALOR
  const data = parts.map((part) => {
    const keyValue = part.trim().split("=");
    const key = keyValue[0];
    const value = keyValue[1];
    return { [key]: value };
  });

  // RETORNO BASEADO NA CHAVE "KEY" ESPERADA PELA FUNÇÃO
  return data.filter((part) => part[key])[0][key]; 
}
