import argon2 from "argon2";

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,

    memoryCost: 19456, // 19 MiB

    timeCost: 2,

    parallelism: 1,
  });
}
