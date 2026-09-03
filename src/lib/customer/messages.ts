export const CUSTOMER_MESSAGES = {
  invalidInput: "Lütfen bilgilerinizi kontrol edin.",
  duplicateEmail: "Bu e-posta adresiyle zaten bir hesap var.",
  invalidCredentials: "E-posta veya şifre hatalı.",
  unauthorized: "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.",
  unavailable: "İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.",
  tooMany: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.",
  forbidden: "Bu istek reddedildi.",
  notFound: "Kayıt bulunamadı.",
} as const;

export function customerMessageForStatus(
  status: number,
  remoteMessage?: string,
): string {
  if (status === 401) {
    const remote = (remoteMessage ?? "").toLowerCase();
    if (remote.includes("password") || remote.includes("email or password")) {
      return CUSTOMER_MESSAGES.invalidCredentials;
    }
    return CUSTOMER_MESSAGES.unauthorized;
  }
  if (status === 409) {
    return CUSTOMER_MESSAGES.duplicateEmail;
  }
  if (status === 400) {
    return CUSTOMER_MESSAGES.invalidInput;
  }
  if (status === 403) {
    return CUSTOMER_MESSAGES.forbidden;
  }
  if (status === 404) {
    return CUSTOMER_MESSAGES.notFound;
  }
  if (status === 429) {
    return CUSTOMER_MESSAGES.tooMany;
  }
  return CUSTOMER_MESSAGES.unavailable;
}
