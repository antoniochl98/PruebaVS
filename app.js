'use strict';

const escodegen = require('escodegen');
const espree = require('espree');
const estraverse = require('estraverse');

function addLogging(code) {
    const ast = espree.parse(code);
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression') {
                addBeforeCode(node);
            }
        }
    });
    return escodegen.generate(ast);
}

function addBeforeCode(node) {
    const name = node.id ? node.id.name : '<anonymous function>';
    //params = node.params.name;
    let params = "";
    node.params.forEach(i => params += "${" + i.name + "}, ");
    if (params !== "") {
        params = params.slice(0,-2)
    }
    console.log(params);
    const beforeCode = "console.log('Entering " + name + "("+params+")');";
    const beforeNodes = espree.parse(beforeCode).body;
    node.body.body = beforeNodes.concat(node.body.body);
}

console.log(addLogging(`
function foo(a, b) {   
  var x = 'blah';   
  var y = (function () {
    return 3;
  })();
}
foo(1, 'wut', 3);
`));
