import { SingleBar } from "cli-progress";

export function getProgressOptions(name: string, fixedLength: number) {
  return {
    format: `${name.padEnd(fixedLength)} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
  };
}
export function createProgressBar(name: string, fixedLength = 0) {
  return new SingleBar(getProgressOptions(name, fixedLength));
}
