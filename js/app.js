customSelect("select");
const formulae = {
        s: {
            "v t": "( v * t )",
            "u v a": "( ( v ** 2 ) - ( u ** 2 ) ) / ( 2 * a )",
            "u t a": "( u * t ) + ( ( 0.5 * a ) * ( t ** 2 ) )",
        },
        v: {
            "s t": "( s / t )",
            "u t a": "( u + ( a * t ) )",
            "s u a": "Math.sqrt( ( ( 2 * a ) * s ) + ( u ** 2 ) )",
        },
        u: {
            "v t a": "( v - ( a * t ) )",
            "s v a": "( ( 2 * a ) * s ) + ( v ** 2 )",
        },
        t: {
            "s v": "( s / v )",
            "u v a": "( ( v - u ) / a )",
        },
        a: {
            "u v t": "( ( v - u ) / t )",
            "s u v": "( ( ( v ** 2 ) - ( u ** 2 ) ) / s ) / 2",
        },
    },
    units = {
        s: "m",
        v: "ms<sup>-1</sup>",
        u: "ms<sup>-1</sup>",
        t: "s",
        a: "ms<sup>-2</sup>",
    },
    toFind = document.querySelector("#find"),
    given = document.querySelector("#given"),
    equation = document.querySelector("#equation"),
    solveBtn = document.querySelector("#solve-btn");

Object.keys(formulae).forEach((option) => addOptions(toFind, option));
toFind.onchange = () => {
    given.parentElement.customSelect.empty();
    Object.keys(formulae[toFind.value]).forEach((key) => addOptions(given, key));
};

given.onchange = () => {
    document.body.setAttribute("id", "equation-screen");
    let formula = formulae[toFind.value][given.value]
        .toUpperCase()
        .replace(/[()]|MATH.SQRT/g, ""),
        quantities = new Set(formula.replace(/[^A-Za-z]+/g, "").split(""));
    quantities.forEach((quantity) => {
        formula = formula.replace(
            new RegExp(quantity, "g"),
            `<input type='number' id=${quantity.toLowerCase()} placeholder='${quantity}'>`
        );
    });
    formula = formula
        .replace(/[/]/g, "<span id='upon'></span>")
        .replace(/[*]+\s2/g, "<sup>2</sup>")
        .replace(/[*]{1}?/g, "x");
    equation.setAttribute(
        "class",
        `${toFind.value}/${given.value.replace(/[\s]/g, "_")}`
    );
    equation.innerHTML = `<span id="lhs">${toFind.value}</span> = <span id="rhs">${formula}</span>`;
};

solveBtn.onclick = () => {
    if (!validateAll()) return;
    let inputs = document.querySelectorAll("input"),
        [toFind, formulaTemplate] = equation
        .getAttribute("class")
        .replace(/[_]/g, " ")
        .split("/"),
        formula = formulae[toFind][formulaTemplate];
    inputs.forEach((input) => {
        formula = formula.replace(
            new RegExp(`\\s${input.id}\\s`, "g"),
            input.value
        );
    });
    document.body.setAttribute("id", "solution-screen");
    let lhs = document.querySelector("#lhs").innerHTML;
    equation.parentElement.innerHTML = `<h2>${lhs} = ${eval(formula)} ${
    units[lhs]
  }</h2>`;
};

function addOptions(element, key) {
    let option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    element.parentElement.customSelect.append(option);
}

function validateAll() {
    return Array.from(document.querySelectorAll("input")).every(
        (input) => !!input.value
    );
}