import RegisterClient from "./RegisterClient";

const THEME_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface RegisterPageProps {
  searchParams: Promise<{ tema?: string | string[] }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const rawTheme = Array.isArray(params.tema) ? params.tema[0] : params.tema;
  const requestedTheme = rawTheme?.trim().toLowerCase() || "";
  const selectedTheme = THEME_SLUG_PATTERN.test(requestedTheme) ? requestedTheme : "";

  return <RegisterClient selectedTheme={selectedTheme} />;
}
