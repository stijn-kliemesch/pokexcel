import { decode } from 'he'
import { INode, IText, ITag, SyntaxKind, parse } from 'html5parser';

export function _getNodeText(node: INode): string {
    try {
        if (!node) throw "NODE WAS FALSY";
        return (node.type === SyntaxKind.Text
            ? node.value
            : !!node.body
                ? node.body.map(_getNodeText).join()
                : "") as string;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN _getNodeText";
    }
}

export function getNodeText(node: INode) {
    try {
        if (!node) throw "NODE WAS FALSY";
        return decode(_getNodeText(node)) as string;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getNodeText";
    }
}

export function nodeHasBody(node: INode) {
    try {
        if (!node) throw "NODE WAS FALSY";
        return isTagNode(node) && node.body !== undefined;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN nodeHasBody";
    }
}

export function getNodeBody(node: INode): Array<ITag | IText> {
    return nodeHasBody(node)
        ? ((node as ITag).body) as Array<ITag | IText>
        : []
}

export function isTextNode(node: INode) {
    try {
        if (!node) throw "NODE WAS FALSY";
        return node.type === SyntaxKind.Text;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN isTextNode";
    }
}

export function isTagNode(node: INode) {
    try {
        if (!node) throw "NODE WAS FALSY";
        return node.type === SyntaxKind.Tag;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN isTagNode";
    }
}

export function nodeIsSelfCloser(node: INode) {
    try {
        if (!node) throw "NODE WAS FALSY";
        return isTagNode(node) && node.body === undefined;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN nodeIsSelfCloser";
    }
}

export function getAttributeOrFalse(node: INode, attributeName: string, isToBeDecoded: boolean = true) {
    try {
        if (!node) throw "NODE WAS FALSY";
        if (!attributeName) throw "ATTRIBUTENAME WAS FALSY";
        if (!isTagNode(node)) throw "ONLY TAGNODES CAN HAVE ATTRIBUTES";
        for (const attribute of node.attributes) {
            if (attribute.name.value === attributeName && attribute.value) {
                return isToBeDecoded
                    ? (attribute.value.value as string)
                    : (decode(attribute.value.value) as string);
            }
        }
        return false;
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getAttributeOrFalse";
    }
}

export function getElementClasses(node: INode): string[] {
    try {
        if (!node) throw "NODE WAS FALSY";
        if (!isTagNode(node)) throw "ONLY TAGNODES CAN HAVE CLASSES";
        const classesValue = getAttributeOrFalse(node, "class");
        if (classesValue) {
            return classesValue
                .trim()
                .split(/\s+/)
                .filter((el) => el.length > 0);
        }
        return [];
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN getElementClasses";
    }
}

export function elementHasClass(node: INode, clazz: string) {
    try {
        if (!node) throw "NODE WAS FALSY";
        if (!clazz) throw "CLASS WAS FALSY";
        return getElementClasses(node).includes(clazz);
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN elementHasClass";
    }
}