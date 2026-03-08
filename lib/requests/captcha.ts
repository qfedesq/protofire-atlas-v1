import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

type ArithmeticOperator = "+" | "-";

type CaptchaPayload = {
  answer: number;
  issuedAt: string;
};

export type ArithmeticCaptchaChallenge = {
  prompt: string;
  token: string;
};

function getCaptchaSecret() {
  return process.env.ATLAS_FORM_SIGNING_SECRET ?? "atlas-local-form-secret";
}

function encodePayload(payload: CaptchaPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getCaptchaSecret())
    .update(encodedPayload)
    .digest("hex");
}

function buildToken(payload: CaptchaPayload) {
  const encodedPayload = encodePayload(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function createArithmeticCaptcha(options?: {
  firstNumber?: number;
  secondNumber?: number;
  operator?: ArithmeticOperator;
  issuedAt?: string;
}): ArithmeticCaptchaChallenge {
  const operator = options?.operator ?? (randomInt(0, 2) === 0 ? "+" : "-");
  let firstNumber = options?.firstNumber ?? randomInt(2, 10);
  let secondNumber = options?.secondNumber ?? randomInt(1, 9);

  if (operator === "-" && firstNumber < secondNumber) {
    [firstNumber, secondNumber] = [secondNumber, firstNumber];
  }

  const answer =
    operator === "+"
      ? firstNumber + secondNumber
      : firstNumber - secondNumber;
  const issuedAt = options?.issuedAt ?? new Date().toISOString();

  return {
    prompt: `What is ${firstNumber} ${operator} ${secondNumber}?`,
    token: buildToken({
      answer,
      issuedAt,
    }),
  };
}

export function verifyArithmeticCaptcha(
  token: string,
  answer: string,
  options?: {
    now?: Date;
    maxAgeMinutes?: number;
  },
) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (
    signature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return false;
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as CaptchaPayload;
  const issuedAt = new Date(payload.issuedAt);
  const now = options?.now ?? new Date();
  const maxAgeMinutes = options?.maxAgeMinutes ?? 60;

  if (Number.isNaN(issuedAt.getTime())) {
    return false;
  }

  if (now.getTime() - issuedAt.getTime() > maxAgeMinutes * 60 * 1000) {
    return false;
  }

  return String(payload.answer) === answer.trim();
}
