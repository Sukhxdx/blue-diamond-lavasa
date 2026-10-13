export function passwordProblems(password: string, email: string): string[] {
  const problems: string[] = [];
  if (password.length < 12) problems.push("Use at least 12 characters.");
  if (!/[a-z]/.test(password)) problems.push("Add a lowercase letter.");
  if (!/[A-Z]/.test(password)) problems.push("Add an uppercase letter.");
  if (!/[0-9]/.test(password)) problems.push("Add a digit.");
  if (!/[^A-Za-z0-9]/.test(password)) problems.push("Add a symbol.");
  if (password.toLowerCase() === email.toLowerCase()) problems.push("Do not use the email as the password.");
  return problems;
}
