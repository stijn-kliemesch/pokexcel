
export function err(error: string): never {
    throw error;
}

export async function tryCatch<T>(callback: (...args: any) => T | Promise<T>): Promise<T> {
    try {
        return (await callback());
    } catch (error) {
        console.error(error);
        throw error;
    }
}
