import type { InitialTask } from "@/types/tasksTypes";
export const initialTasks: InitialTask[] = [
  {
    title: "Java Theory Quiz",
    description:
      "Test your understanding of Java syntax, OOP principles, and core libraries.",
    level: "intermediate",
    language: "java",
    type: "theory",
    theory_question: [
      {
        question: "Which keyword is used to define a class in Java?",
        options: ["class", "Class", "define", "public class"],
        correct_answer: ["class"],
      },
      {
        question: "Which of the following are valid access modifiers in Java?",
        options: ["public", "private", "protected", "internal", "package"],
        correct_answer: ["public", "private", "protected"],
      },
      {
        question: "Which of the following are primitive types in Java?",
        options: ["int", "String", "boolean", "char", "List"],
        correct_answer: ["int", "boolean", "char"],
      },
      {
        question: "Which method is the entry point of a Java application?",
        options: [
          "main()",
          "Main()",
          "public void start()",
          "public static void main(String[] args)",
        ],
        correct_answer: ["public static void main(String[] args)"],
      },
      {
        question: "What is the size of `int` in Java?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
        correct_answer: ["4 bytes"],
      },
      {
        question: "Which of the following are valid loop types in Java?",
        options: ["for", "while", "do-while", "foreach", "loop"],
        correct_answer: ["for", "while", "do-while"],
      },
      {
        question: "Which of the following classes implement List interface?",
        options: ["ArrayList", "LinkedList", "HashMap", "HashSet"],
        correct_answer: ["ArrayList", "LinkedList"],
      },
      {
        question: "What is the purpose of `final` keyword in Java?",
        options: [
          "To prevent inheritance",
          "To create constants",
          "To prevent method override",
          "All of the above",
        ],
        correct_answer: ["All of the above"],
      },
      {
        question: "Which exception is unchecked in Java?",
        options: [
          "IOException",
          "NullPointerException",
          "SQLException",
          "FileNotFoundException",
        ],
        correct_answer: ["NullPointerException"],
      },
      {
        question: "Which of the following are features of OOP in Java?",
        options: ["Encapsulation", "Polymorphism", "Inheritance", "Modularity"],
        correct_answer: ["Encapsulation", "Polymorphism", "Inheritance"],
      },
      {
        question: "How do you create an object in Java?",
        options: [
          "new ClassName();",
          "ClassName obj = new ClassName();",
          "ClassName obj();",
          "ClassName = new();",
        ],
        correct_answer: ["ClassName obj = new ClassName();"],
      },
      {
        question:
          "Which of the following are valid types of constructors in Java?",
        options: [
          "Default constructor",
          "Parameterized constructor",
          "Static constructor",
          "Copy constructor",
        ],
        correct_answer: ["Default constructor", "Parameterized constructor"],
      },
      {
        question: "Which statement is used to handle exceptions in Java?",
        options: ["try-catch", "try-except", "catch-except", "error-handler"],
        correct_answer: ["try-catch"],
      },
      {
        question:
          "Which of the following interfaces are part of Java Collections Framework?",
        options: ["List", "Set", "Map", "Array"],
        correct_answer: ["List", "Set", "Map"],
      },
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["extends", "implements", "inherits", "super"],
        correct_answer: ["extends"],
      },
      {
        question:
          "Which interface must a class implement to be run by a thread?",
        options: ["Runnable", "Threadable", "Callable", "Executor"],
        correct_answer: ["Runnable"],
      },
      {
        question: "Which of the following are wrapper classes in Java?",
        options: ["Integer", "Boolean", "Double", "int", "boolean"],
        correct_answer: ["Integer", "Boolean", "Double"],
      },
      {
        question: "What does `static` mean in Java?",
        options: [
          "Belongs to the class rather than an instance",
          "Can be called without creating an object",
          "Shared across all instances",
          "All of the above",
        ],
        correct_answer: ["All of the above"],
      },
      {
        question: "Which Java keyword is used to stop method overriding?",
        options: ["final", "static", "abstract", "override"],
        correct_answer: ["final"],
      },
      {
        question: "Which operator is used for object comparison?",
        options: ["==", ".equals()", "!=", "compare()"],
        correct_answer: [".equals()"],
      },
      {
        question: "Which collection does not allow duplicate elements?",
        options: ["List", "Set", "ArrayList", "Map"],
        correct_answer: ["Set"],
      },
      {
        question:
          "Which of the following are correct ways to handle multiple exceptions?",
        options: [
          "Multiple catch blocks",
          "Single catch block with | operator",
          "Nested try-catch",
          "None of the above",
        ],
        correct_answer: [
          "Multiple catch blocks",
          "Single catch block with | operator",
          "Nested try-catch",
        ],
      },
      {
        question: "Which keyword is used to implement an interface?",
        options: ["implements", "extends", "inherits", "interface"],
        correct_answer: ["implements"],
      },
      {
        question: "What does JVM stand for?",
        options: [
          "Java Virtual Machine",
          "Java Verified Module",
          "Just-in-time Virtual Machine",
          "Java Variable Memory",
        ],
        correct_answer: ["Java Virtual Machine"],
      },
      {
        question: "Which method is used to start a thread in Java?",
        options: ["run()", "start()", "execute()", "begin()"],
        correct_answer: ["start()"],
      },
      {
        question: "Which data type is used for decimal numbers in Java?",
        options: ["float", "double", "int", "decimal"],
        correct_answer: ["float", "double"],
      },
      {
        question: "What is the default value of a boolean variable in Java?",
        options: ["true", "false", "null", "undefined"],
        correct_answer: ["false"],
      },
      {
        question: "Which package contains the Scanner class?",
        options: ["java.util", "java.io", "java.lang", "java.text"],
        correct_answer: ["java.util"],
      },
      {
        question: 'What will `System.out.println(10 + 20 + "30")` print?',
        options: ["3030", "102030", "60", "3030.0"],
        correct_answer: ["3030"],
      },
      {
        question: "Which class is used to create an immutable string?",
        options: ["String", "StringBuilder", "StringBuffer", "CharSequence"],
        correct_answer: ["String"],
      },
    ],
  },
  {
    title: "JavaScript Theory Quiz",
    description:
      "Test your knowledge of JavaScript fundamentals, features, and quirks.",
    level: "intermediate",
    language: "javascript",
    type: "theory",
    theory_question: [
      {
        question: "Which of the following are primitive types in JavaScript?",
        options: [
          "String",
          "Number",
          "Object",
          "Boolean",
          "Array",
          "Null",
          "Undefined",
        ],
        correct_answer: ["String", "Number", "Boolean", "Null", "Undefined"],
      },
      {
        question: "What is the output of `typeof null`?",
        options: ["null", "object", "undefined", "string"],
        correct_answer: ["object"],
      },
      {
        question: "Which values are considered falsy in JavaScript?",
        options: ["0", "null", "undefined", "false", "NaN", `""`, "[]"],
        correct_answer: ["0", "null", "undefined", "false", "NaN", `""`],
      },
      {
        question: "What is the purpose of the `let` keyword?",
        options: [
          "Declares a block-scoped variable",
          "Declares a globally-scoped variable",
          "Declares a constant",
          "Declares a function",
        ],
        correct_answer: ["Declares a block-scoped variable"],
      },
      {
        question:
          "Which of the following are correct ways to define a function in JavaScript?",
        options: [
          "function foo() {}",
          "const foo = function() {}",
          "const foo = () => {}",
          "def foo():",
        ],
        correct_answer: [
          "function foo() {}",
          "const foo = function() {}",
          "const foo = () => {}",
        ],
      },
      {
        question: "What does `===` compare in JavaScript?",
        options: [
          "Value only",
          "Value and type",
          "Reference only",
          "Memory address",
        ],
        correct_answer: ["Value and type"],
      },
      {
        question: "Which array method returns a new array?",
        options: ["map", "forEach", "push", "pop"],
        correct_answer: ["map"],
      },
      {
        question: "What is the output of `[1, 2] + [3, 4]`?",
        options: ["[1,2,3,4]", "10", "1,23,4"],
        correct_answer: ["1,23,4"],
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function inside another function",
          "A function having access to variables of its outer function even after outer function returns",
          "A function without a return statement",
          "An object binding to another object",
        ],
        correct_answer: [
          "A function having access to variables of its outer function even after outer function returns",
        ],
      },
      {
        question: "Which of the following are valid ways to create an object?",
        options: [
          "let obj = {}",
          "let obj = new Object()",
          "let obj = Object.create(null)",
          "let obj = []",
        ],
        correct_answer: [
          "let obj = {}",
          "let obj = new Object()",
          "let obj = Object.create(null)",
        ],
      },
      {
        question: "What is the result of `NaN === NaN`?",
        options: ["true", "false", "TypeError", "undefined"],
        correct_answer: ["false"],
      },
      {
        question: "What is the purpose of `use strict`?",
        options: [
          "Enables stricter parsing and error handling",
          "Enables multithreading",
          "Allows undeclared variables",
          "Improves performance",
        ],
        correct_answer: ["Enables stricter parsing and error handling"],
      },
      {
        question: "Which loop guarantees at least one iteration?",
        options: ["for", "while", "do...while", "forEach"],
        correct_answer: ["do...while"],
      },
      {
        question: "Which keyword stops a loop immediately?",
        options: ["stop", "end", "break", "return"],
        correct_answer: ["break"],
      },
      {
        question: "Which methods can convert a string to an integer?",
        options: ["parseInt", "Number", "toString", "JSON.stringify"],
        correct_answer: ["parseInt", "Number"],
      },
      {
        question: "What is the result of `typeof NaN`?",
        options: ["number", "NaN", "undefined", "object"],
        correct_answer: ["number"],
      },
      {
        question: "What is hoisting in JavaScript?",
        options: [
          "Moving variable and function declarations to the top of their scope",
          "Binding objects to a class",
          "Executing async functions",
          "Garbage collecting unused variables",
        ],
        correct_answer: [
          "Moving variable and function declarations to the top of their scope",
        ],
      },
      {
        question: "Which are valid ways to declare a variable?",
        options: ["var", "let", "const", "define"],
        correct_answer: ["var", "let", "const"],
      },
      {
        question: "What is the default value of an uninitialized variable?",
        options: ["null", "0", "undefined", "false"],
        correct_answer: ["undefined"],
      },
      {
        question:
          "Which of the following are asynchronous operations in JavaScript?",
        options: ["setTimeout", "Promise", "for loop", "fetch"],
        correct_answer: ["setTimeout", "Promise", "fetch"],
      },
      {
        question: "What is the purpose of the `Promise` object?",
        options: [
          "To handle asynchronous operations",
          "To create loops",
          "To define classes",
          "To manipulate DOM",
        ],
        correct_answer: ["To handle asynchronous operations"],
      },
      {
        question: "What is the output of `typeof []`?",
        options: ["array", "object", "undefined", "function"],
        correct_answer: ["object"],
      },
      {
        question: "Which keyword is used to inherit a class in JavaScript?",
        options: ["extends", "inherits", "prototype", "super"],
        correct_answer: ["extends"],
      },
      {
        question: "What is the difference between `==` and `===`?",
        options: [
          "`==` compares value only, `===` compares value and type",
          "`===` is used for objects only",
          "`==` compares reference",
          "They are the same",
        ],
        correct_answer: [
          "`==` compares value only, `===` compares value and type",
        ],
      },
      {
        question:
          "What does the `this` keyword refer to in a regular function (non-arrow)?",
        options: [
          "The calling object",
          "The global object",
          "undefined",
          "Itself",
        ],
        correct_answer: ["The calling object"],
      },
      {
        question: "What is the result of `[...'abc']`?",
        options: ["['abc']", "[a,b,c]", "['a','b','c']", "[abc]", "Error"],
        correct_answer: ["['a','b','c']"],
      },
      {
        question: "Which of the following are array methods?",
        options: ["map", "filter", "reduce", "assign"],
        correct_answer: ["map", "filter", "reduce"],
      },
      {
        question: "How to deep copy an object in JavaScript?",
        options: [
          "JSON.parse(JSON.stringify(obj))",
          "Object.assign({}, obj)",
          "spread operator {...obj}",
          "obj.clone()",
        ],
        correct_answer: ["JSON.parse(JSON.stringify(obj))"],
      },
      {
        question: "What does `Array.isArray([])` return?",
        options: ["true", "false", "null", "undefined"],
        correct_answer: ["true"],
      },
      {
        question: "Which of the following are true about arrow functions?",
        options: [
          "They do not bind their own `this`",
          "They are always anonymous",
          "They can be used as constructors",
          "They are hoisted",
        ],
        correct_answer: [
          "They do not bind their own `this`",
          "They are always anonymous",
        ],
      },
    ],
  },
  {
    title: "Python Theory Quiz",
    description:
      "Test your knowledge of Python syntax, types, functions, and core concepts.",
    level: "intermediate",
    language: "python",
    type: "theory",
    theory_question: [
      {
        question: "What is the output of `type([])`?",
        options: ["list", "<class 'list'>", "tuple", "array"],
        correct_answer: ["<class 'list'>"],
      },
      {
        question: "Which of the following are immutable types in Python?",
        options: ["tuple", "list", "set", "str", "dict", "int"],
        correct_answer: ["tuple", "str", "int"],
      },
      {
        question:
          "What does the `len()` function return when passed a dictionary?",
        options: [
          "Number of keys",
          "Number of values",
          "Sum of all values",
          "None",
        ],
        correct_answer: ["Number of keys"],
      },
      {
        question: "What keyword is used to define a function in Python?",
        options: ["def", "func", "function", "define"],
        correct_answer: ["def"],
      },
      {
        question: "What is the result of `bool([])`?",
        options: ["True", "False", "None", "Error"],
        correct_answer: ["False"],
      },
      {
        question: "Which of the following are valid Python data structures?",
        options: ["list", "set", "map", "tuple", "dict"],
        correct_answer: ["list", "set", "tuple", "dict"],
      },
      {
        question: "What will `range(3)` return?",
        options: ["[0, 1, 2]", "[1, 2, 3]", "range(0, 3)", "[0, 1, 2, 3]"],
        correct_answer: ["range(0, 3)"],
      },
      {
        question: "How do you create a virtual environment in Python 3?",
        options: [
          "python -m venv env",
          "python3 -m venv env",
          "virtualenv env",
          "venv env",
        ],
        correct_answer: ["python -m venv env", "python3 -m venv env"],
      },
      {
        question: "What is the difference between `is` and `==`?",
        options: [
          "`is` compares identity, `==` compares values",
          "They are the same",
          "`==` is faster than `is`",
          "`is` works only for strings",
        ],
        correct_answer: ["`is` compares identity, `==` compares values"],
      },
      {
        question: "Which of the following raise a `ZeroDivisionError`?",
        options: ["1/0", "1.0/0.0", "10 % 0", "math.sqrt(-1)"],
        correct_answer: ["1/0", "1.0/0.0", "10 % 0"],
      },
      {
        question: "Which of the following are valid ways to handle exceptions?",
        options: [
          "try/except",
          "try/except/finally",
          "try/catch",
          "try/except/else",
        ],
        correct_answer: ["try/except", "try/except/finally", "try/except/else"],
      },
      {
        question: "What is the output of `'hello'[::-1]`?",
        options: ["'olleh'", "'hello'", "Error", "['h', 'e', 'l', 'l', 'o']"],
        correct_answer: ["'olleh'"],
      },
      {
        question: "Which of the following are used to define a class?",
        options: ["class", "def", "object", "new"],
        correct_answer: ["class"],
      },
      {
        question: "Which module is used to work with regular expressions?",
        options: ["regex", "re", "regexp", "rex"],
        correct_answer: ["re"],
      },
      {
        question: "What will `list('abc')` return?",
        options: ["['abc']", "['a', 'b', 'c']", "('a', 'b', 'c')", "Error"],
        correct_answer: ["['a', 'b', 'c']"],
      },
      {
        question: "What is a lambda function?",
        options: [
          "A named function",
          "An anonymous function",
          "A function without return",
          "A generator",
        ],
        correct_answer: ["An anonymous function"],
      },
      {
        question: "Which of the following are built-in Python functions?",
        options: ["map", "filter", "reduce", "compose"],
        correct_answer: ["map", "filter", "reduce"],
      },
      {
        question: "How can you open a file for writing in Python?",
        options: [`"w" mode`, `"r" mode`, `"a" mode`, `"w+" mode`],
        correct_answer: [`"w" mode`, `"a" mode`, `"w+" mode`],
      },
      {
        question: "Which data types are unordered?",
        options: ["set", "dict", "list", "tuple"],
        correct_answer: ["set", "dict"],
      },
      {
        question: "What will be the result of `bool('False')`?",
        options: ["False", "True", "Error", "None"],
        correct_answer: ["True"],
      },
      {
        question: "Which of the following are Python keywords?",
        options: ["yield", "await", "async", "include", "then"],
        correct_answer: ["yield", "await", "async"],
      },
      {
        question: "Which version of Python introduced f-strings?",
        options: ["2.7", "3.5", "3.6", "3.8"],
        correct_answer: ["3.6"],
      },
      {
        question: "How do you define a generator function?",
        options: [
          "Using `yield` inside a function",
          "Using `return` with a list",
          "Using `lambda`",
          "Using `async def`",
        ],
        correct_answer: ["Using `yield` inside a function"],
      },
      {
        question: "What does `*args` do in a function definition?",
        options: [
          "Accepts variable number of positional arguments",
          "Defines keyword-only arguments",
          "Unpacks lists",
          "Creates default arguments",
        ],
        correct_answer: ["Accepts variable number of positional arguments"],
      },
      {
        question: "Which of the following are mutable?",
        options: ["list", "set", "dict", "tuple"],
        correct_answer: ["list", "set", "dict"],
      },
      {
        question: "How do you write a comment in Python?",
        options: [
          "// comment",
          "# comment",
          "/* comment */",
          "<!-- comment -->",
        ],
        correct_answer: ["# comment"],
      },
      {
        question: "What is the output of `bool(0)`?",
        options: ["False", "True", "None", "Error"],
        correct_answer: ["False"],
      },
      {
        question: "What will `int('10', 2)` return?",
        options: ["2", "10", "8", "Error"],
        correct_answer: ["2"],
      },
      {
        question: "Which keyword is used to create a coroutine?",
        options: ["async", "await", "yield", "def"],
        correct_answer: ["async"],
      },
      {
        question:
          "Which function converts an object into a string representation?",
        options: ["str()", "repr()", "format()", "stringify()"],
        correct_answer: ["str()", "repr()"],
      },
    ],
  },
];
