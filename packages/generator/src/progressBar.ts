import { SingleBar } from "cli-progress";

export function getProgressOptions(name: string) {
  return {
    format: `${name.padEnd(18)} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
  };
}
export function createProgressBar(name: string) {
  return new SingleBar(getProgressOptions(name));
}
