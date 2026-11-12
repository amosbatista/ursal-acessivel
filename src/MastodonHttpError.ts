interface ISafeHttpError {
  message: string;
  status?: number;
  response?: unknown;
}

const SanitizeHttpError = (error: any): ISafeHttpError => ({
  message: error?.message || 'Erro desconhecido na comunicação com o Mastodon.',
  status: error?.response?.status,
  response: error?.response?.data,
});

export { ISafeHttpError, SanitizeHttpError };
