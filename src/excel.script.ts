const buttonClass = "ms-Button"
const buttonLabelClass = "ms-Button-label"
const inputClasses = {
    text: "ms-TextField-field"
} as const

function _createSpan(value: string, clazz? : string) {
    const span = document.createElement("span");
    if (clazz) span.setAttribute("class", clazz);
    span.textContent = value;
    return span
}

function _createButton(id: string) {
    const button = document.createElement("button");
    button.setAttribute("id", id);
    button.setAttribute("class", buttonClass);
    return button
}

function _labelButton(value: string, button: HTMLButtonElement) {
    button.appendChild(_createSpan(value, buttonLabelClass));
    return button
}

function _createInput(id: string, type: keyof typeof inputClasses) {
    const input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("type", type)
    input.setAttribute("class", inputClasses[type]);
    return input;
}

export const createBr = () => document.createElement("br");

export const createSpan = (value: string) => _createSpan(value);

export const createButton = (id: string, value: string) => _labelButton(value, _createButton(id));

export const createTextField = (id: string) => _createInput(id, "text");
