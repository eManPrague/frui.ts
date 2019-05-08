import { useEffect } from "react";

interface IDisposable {
    dispose(): void;
}

export default function useDisposable(...dependencies: IDisposable[]) {
    useEffect(() => () => {
        dependencies.forEach(x => x.dispose());
    }, []);
}
