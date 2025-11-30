
export function err(error: any): never {
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

// If the predicate causes nothing to be found, the runtime exit can't even be caught (@ toplevel; elsewhere it might hang?)
// Also make the predicate closureless, otherwise it's gonna be memory leaks
export async function findFirstAsyncRace<T extends unknown[]>(arr: T, predicate: (arg: T[number]) => boolean | Promise<boolean>) {
    return Promise.race(arr.map(async row => new Promise<T[number]>(async res => await predicate(row) && res(row))))
}
