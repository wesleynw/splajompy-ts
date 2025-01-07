import { SafeParseError } from "zod";

export function formatErrors(
  result: SafeParseError<{ identifier: string; password: string }>
) {
  const errors = result.error.flatten().fieldErrors as {
    [key: string]: string[];
  };

  const formattedErrors: Record<string, string> = {};
  for (const key in errors) {
    if (errors[key as keyof typeof errors]) {
      formattedErrors[key] = errors[key]?.join(", ") || "Invalid value";
    }
  }

  return formattedErrors;
}
