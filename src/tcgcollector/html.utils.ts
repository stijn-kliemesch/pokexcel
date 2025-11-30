import { INode, parse } from 'html5parser';
import { elementHasClass, getAttributeOrFalse, getElementClasses, getNodeBody, isTagNode, nodeHasBody } from './html';

export function walk2<T>(nodes: Array<T>, predicate: (node: T) => boolean, consumer: (node: T) => Array<T> | void) {
    try {
        if (!nodes) throw "NODES WAS FALSY";
        if (!predicate) throw "PREDICATE WAS FALSY";
        if (!consumer) throw "CONSUMER WAS FALSY";
        if (!Array.isArray(nodes)) throw "NODES NOT AN ARRAY";
        if (nodes.length === 0) return;
        let work = nodes.concat([]);
        for (let node: T = work.shift() as T; work.length > 0; node = work.shift() as T) {
            if (predicate(node)) {
                const produced = consumer(node);
                work.push.apply(work, (Array.isArray(produced) && produced) || []);
            }
        }
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN walk2";
    }
}

export function find2<T>(nodes: Array<T>, predicate: (node: T) => boolean, producer: (node: T) => Array<T> | void) {
    try {
        if (!nodes) throw "NODES WAS FALSY";
        if (!predicate) throw "PREDICATE WAS FALSY";
        if (!producer) throw "CONSUMER WAS FALSY";
        if (!Array.isArray(nodes)) throw "NODES NOT AN ARRAY";
        if (nodes.length === 0) return false;
        let work = nodes.concat([]);
        for (let node: T = work.shift() as T; work.length > 0; node = work.shift() as T) {
            const produced = producer(node);
            work.push.apply(work, (Array.isArray(produced) && produced) || []);
            if (predicate(node)) {
                return node;
            }
        }
        return false; //here?
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN find2";
    }
}

export async function getHtmlFromUrl(url: string) {
    try {
        if (!url) throw "URL WAS FALSY";
        const fetched = await fetch(url);
        if (!fetched.ok) throw "COULD NOT FETCH";
        return parse(await fetched.text());
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getHtmlFromUrl";
    }
}

export function getNodeByIdOrFalse(nodes: Array<INode>, search: string) {
    try {
        if (!nodes) throw "NODES WAS FALSY";
        if (!Array.isArray(nodes)) throw "NODES NOT AN ARRAY";

        return find2(
            nodes,
            (node) => isTagNode(node) && getAttributeOrFalse(node, "id") === search,
            getNodeBody,
        );
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getNodeByIdOrFalse";
    }
}

export function getNodesMappedToClass(nodes: Array<INode>, deep?: boolean) {
    try {
        if (!nodes) throw "NODES WAS FALSY";
        if (!Array.isArray(nodes)) throw "NODES NOT AN ARRAY";
        const classRegistry = {} as Record<string, Array<INode>>;
        walk2(nodes, isTagNode, (node) => {
            getElementClasses(node).forEach((clazz) => (classRegistry[clazz] ??= []).push(node));
            if (deep) return getNodeBody(node);
        });
        return classRegistry;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getNodesMappedToClass";
    }
}

export function getNodesOfClass(node: INode, clazz: string) {
    try {
        if (!node) throw "NODE WAS FALSY";
        if (!clazz) throw "CLASS WAS FALSY";
        if (!isTagNode(node)) throw "ONLY TAGNODES CAN HAVE A BODY";
        const nodes = [] as Array<INode>;
        walk2(
            getNodeBody(node),
            (element) => nodeHasBody(element) && elementHasClass(element, clazz),
            (element) => (nodes.push(element), undefined),
        );
        return nodes;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getNodesOfClass";
    }
}
