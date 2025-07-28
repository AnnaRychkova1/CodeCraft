import type { InitialTask } from "@/types/tasksTypes";
export const initialTasks: InitialTask[] = [
  {
    title: "Java Basics Quiz",
    description: "Check your basic understanding of Java programming.",
    level: "beginner",
    language: "java",
    type: "theory",
    theory_question: [
      {
        question:
          "Which keyword is used to start the definition of a Java class?",
        options: ["class", "Class", "define", "new"],
        correct_answer: ["class"],
      },
      {
        question: "What symbol is used to end a statement in Java?",
        options: [".", ";", ":", "!"],
        correct_answer: [";"],
      },
      {
        question: "Which of the following are valid variable types in Java?",
        options: ["int", "String", "float", "word"],
        correct_answer: ["int", "String", "float"],
      },
      {
        question:
          "Which of these is used to print text to the console in Java?",
        options: ["print()", "System.out.println()", "console.log()", "echo()"],
        correct_answer: ["System.out.println()"],
      },
      {
        question: "How do you write a single-line comment in Java?",
        options: [
          "// comment",
          "# comment",
          "/* comment */",
          "<!-- comment -->",
        ],
        correct_answer: ["// comment"],
      },
      {
        question: "Which keyword is used to create an object in Java?",
        options: ["create", "new", "object", "make"],
        correct_answer: ["new"],
      },
      {
        question: "Which of the following are valid data types in Java?",
        options: ["double", "boolean", "array", "integer"],
        correct_answer: ["double", "boolean"],
      },
      {
        question: "What is the correct way to declare a string in Java?",
        options: [
          'String name = "John";',
          "string name = 'John';",
          "String = 'John';",
          'str name = "John";',
        ],
        correct_answer: ['String name = "John";'],
      },
      {
        question: "Which keyword is used to define a method in Java?",
        options: ["def", "function", "void", "method"],
        correct_answer: ["void"],
      },
      {
        question: "What does `int` represent in Java?",
        options: [
          "Decimal number",
          "Integer number",
          "Text value",
          "Boolean value",
        ],
        correct_answer: ["Integer number"],
      },
      {
        question: "How do you write a block of code in Java?",
        options: [
          "With indentations",
          "With square brackets []",
          "With braces {}",
          "With parentheses ()",
        ],
        correct_answer: ["With braces {}"],
      },
      {
        question: "Which of these is a loop in Java?",
        options: ["repeat", "foreach", "for", "loop"],
        correct_answer: ["for"],
      },
      {
        question: "What does `true` or `false` represent in Java?",
        options: ["String", "int", "boolean", "char"],
        correct_answer: ["boolean"],
      },
      {
        question: "How do you declare an integer variable in Java?",
        options: ["int x = 5;", "x = 5;", "int = 5;", "number x = 5;"],
        correct_answer: ["int x = 5;"],
      },
      {
        question: "Which symbol is used for 'equal to' comparison?",
        options: ["=", "==", "===", "equals"],
        correct_answer: ["=="],
      },
      {
        question:
          "What is the default value of an uninitialized `int` in Java?",
        options: ["0", "null", "undefined", "false"],
        correct_answer: ["0"],
      },
      {
        question: "Which keyword defines a constant value in Java?",
        options: ["constant", "let", "final", "const"],
        correct_answer: ["final"],
      },
      {
        question:
          "Which of the following are valid arithmetic operators in Java?",
        options: ["+", "-", "*", "/", "%"],
        correct_answer: ["+", "-", "*", "/", "%"],
      },
      {
        question: "Which keyword is used to exit a loop early?",
        options: ["exit", "end", "break", "stop"],
        correct_answer: ["break"],
      },
      {
        question: "How do you write a multi-line comment in Java?",
        options: [
          "/* comment */",
          "// comment //",
          "-- comment --",
          "# comment #",
        ],
        correct_answer: ["/* comment */"],
      },
      {
        question: "What does the `main` method do in Java?",
        options: [
          "It prints output",
          "It starts program execution",
          "It ends the program",
          "It handles errors",
        ],
        correct_answer: ["It starts program execution"],
      },
      {
        question: "What is the extension of a Java source file?",
        options: [".js", ".java", ".class", ".jav"],
        correct_answer: [".java"],
      },
      {
        question:
          "Which of these keywords is used to define a class member that does not belong to any instance?",
        options: ["final", "private", "static", "global"],
        correct_answer: ["static"],
      },
    ],
  },
  {
    title: "JavaScript Basics Quiz",
    description: "Test your understanding of fundamental JavaScript concepts.",
    level: "beginner",
    language: "javascript",
    type: "theory",
    theory_question: [
      {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["var", "let", "const", "define"],
        correct_answer: ["var", "let", "const"],
      },
      {
        question: "What is the output of `typeof 'hello'`?",
        options: ["string", "text", "char", "word"],
        correct_answer: ["string"],
      },
      {
        question: "Which of the following is a correct string?",
        options: [`"hello"`, `'hello'`, "`hello`", `hello`],
        correct_answer: [`"hello"`, `'hello'`, "`hello`"],
      },
      {
        question: "How do you write a single-line comment in JavaScript?",
        options: [
          "// comment",
          "# comment",
          "/* comment */",
          "<!-- comment -->",
        ],
        correct_answer: ["// comment"],
      },
      {
        question: "What does `===` mean in JavaScript?",
        options: [
          "Equality with type check",
          "Assignment",
          "Comparison only",
          "Always true",
        ],
        correct_answer: ["Equality with type check"],
      },
      {
        question: "Which data types exist in JavaScript?",
        options: ["string", "number", "boolean", "integer"],
        correct_answer: ["string", "number", "boolean"],
      },
      {
        question: "What will `true && false` return?",
        options: ["true", "false", "undefined", "null"],
        correct_answer: ["false"],
      },
      {
        question: "How do you define a function in JavaScript?",
        options: [
          "function myFunc() {}",
          "def myFunc() {}",
          "fun myFunc() {}",
          "method myFunc() {}",
        ],
        correct_answer: ["function myFunc() {}"],
      },
      {
        question: "What does `console.log()` do?",
        options: [
          "Saves a value",
          "Prints to the browser console",
          "Writes to a file",
          "Pauses execution",
        ],
        correct_answer: ["Prints to the browser console"],
      },
      {
        question: "Which of these is a loop in JavaScript?",
        options: ["loop", "for", "foreach", "repeat"],
        correct_answer: ["for"],
      },
      {
        question: "How do you check if two values are equal in value and type?",
        options: ["==", "===", "!=", "equals"],
        correct_answer: ["==="],
      },
      {
        question: "What will `typeof null` return?",
        options: ["null", "object", "undefined", "false"],
        correct_answer: ["object"],
      },
      {
        question: "How do you create an array in JavaScript?",
        options: [
          "let a = [1, 2, 3]",
          "let a = (1, 2, 3)",
          "let a = {1, 2, 3}",
          "let a = <1, 2, 3>",
        ],
        correct_answer: ["let a = [1, 2, 3]"],
      },
      {
        question: "What does `NaN` stand for?",
        options: [
          "Not a Number",
          "No assigned Name",
          "Negative and Null",
          "New async Node",
        ],
        correct_answer: ["Not a Number"],
      },
      {
        question: "Which function is used to convert a string to an integer?",
        options: ["parseInt()", "toInt()", "parseFloat()", "Number()"],
        correct_answer: ["parseInt()", "Number()"],
      },
      {
        question: "What is the result of `'5' + 3` in JavaScript?",
        options: ["8", "53", "Error", "undefined"],
        correct_answer: ["53"],
      },
      {
        question: "Which of the following are falsy values in JavaScript?",
        options: ["0", "''", "null", "true"],
        correct_answer: ["0", "''", "null"],
      },
      {
        question: "What keyword is used to skip one iteration in a loop?",
        options: ["break", "skip", "continue", "exit"],
        correct_answer: ["continue"],
      },
      {
        question: "Which method adds an item to the end of an array?",
        options: ["push()", "pop()", "shift()", "append()"],
        correct_answer: ["push()"],
      },
      {
        question: "How do you write an if statement in JavaScript?",
        options: [
          "if (x > 0) {}",
          "if x > 0 then {}",
          "when (x > 0) {}",
          "x > 0 ? {}",
        ],
        correct_answer: ["if (x > 0) {}"],
      },
      {
        question: "What will `Boolean('')` return?",
        options: ["true", "false", "null", "error"],
        correct_answer: ["false"],
      },
      {
        question: "How do you access the second element in an array `arr`?",
        options: ["arr[1]", "arr(2)", "arr{1}", "arr.1"],
        correct_answer: ["arr[1]"],
      },
      {
        question: "What is the purpose of `return` in a function?",
        options: [
          "It logs the result",
          "It exits the function and outputs a value",
          "It pauses the function",
          "It stores a value",
        ],
        correct_answer: ["It exits the function and outputs a value"],
      },
      {
        question: "Which statement correctly declares a constant?",
        options: [
          "const x = 5;",
          "let x = 5;",
          "constant x = 5;",
          "fix x = 5;",
        ],
        correct_answer: ["const x = 5;"],
      },
      {
        question: "Which values are considered truthy?",
        options: ["1", "'hello'", "[]", "null"],
        correct_answer: ["1", "'hello'", "[]"],
      },
    ],
  },
  {
    title: "Python Basics Quiz",
    description: "Test your basic knowledge of Python syntax and behavior.",
    level: "beginner",
    language: "python",
    type: "theory",
    theory_question: [
      {
        question: "How do you print something in Python?",
        options: ["print()", "echo()", "console.log()", "printf()"],
        correct_answer: ["print()"],
      },
      {
        question: "Which of these is a valid variable name in Python?",
        options: ["my_var", "2ndVar", "my-var", "my var"],
        correct_answer: ["my_var"],
      },
      {
        question: "How do you start a comment in Python?",
        options: ["//", "#", "<!--", "/*"],
        correct_answer: ["#"],
      },
      {
        question: "What is the output of `type(5)`?",
        options: ["int", "<class 'int'>", "integer", "number"],
        correct_answer: ["<class 'int'>"],
      },
      {
        question: "Which values are considered falsy in Python?",
        options: ["None", "0", "False", "1"],
        correct_answer: ["None", "0", "False"],
      },
      {
        question: "How do you create a list in Python?",
        options: ["[]", "{}", "()", "<>"],
        correct_answer: ["[]"],
      },
      {
        question: "Which keyword is used for a function in Python?",
        options: ["function", "def", "fun", "define"],
        correct_answer: ["def"],
      },
      {
        question: "Which operator checks equality?",
        options: ["==", "=", "===", "!="],
        correct_answer: ["=="],
      },
      {
        question: "How do you get the length of a list `my_list`?",
        options: [
          "length(my_list)",
          "my_list.length()",
          "len(my_list)",
          "size(my_list)",
        ],
        correct_answer: ["len(my_list)"],
      },
      {
        question: "What is the correct syntax for an if-statement?",
        options: ["if x > 0:", "if (x > 0)", "if x > 0 then", "when x > 0:"],
        correct_answer: ["if x > 0:"],
      },
      {
        question: "What does `None` represent?",
        options: ["0", "null", "no value", "undefined"],
        correct_answer: ["no value"],
      },
      {
        question: "Which data type is immutable in Python?",
        options: ["tuple", "list", "dictionary", "set"],
        correct_answer: ["tuple"],
      },
      {
        question: "How do you define a dictionary in Python?",
        options: [
          "{'key': 'value'}",
          "[key: value]",
          "(key, value)",
          "<key=value>",
        ],
        correct_answer: ["{'key': 'value'}"],
      },
      {
        question: "Which loop types exist in Python?",
        options: ["for", "while", "loop", "foreach"],
        correct_answer: ["for", "while"],
      },
      {
        question: "What is the result of `3 // 2`?",
        options: ["1", "1.5", "2", "0.5"],
        correct_answer: ["1"],
      },
      {
        question: "How do you add an element to a list?",
        options: ["append()", "add()", "insert()", "push()"],
        correct_answer: ["append()", "insert()"],
      },
      {
        question: "How do you start a function called `greet`?",
        options: [
          "def greet():",
          "function greet():",
          "fun greet()",
          "create greet()",
        ],
        correct_answer: ["def greet():"],
      },
      {
        question: "What is the keyword to exit a loop?",
        options: ["break", "exit", "stop", "end"],
        correct_answer: ["break"],
      },
      {
        question: "How do you write a multi-line string in Python?",
        options: [`'''text'''`, `"""text"""`, `'text'`, `"text"`],
        correct_answer: [`'''text'''`, `"""text"""`],
      },
      {
        question: "Which method is used to remove an item from a list?",
        options: ["remove()", "delete()", "pop()", "shift()"],
        correct_answer: ["remove()", "pop()"],
      },
      {
        question: "What is the result of `bool('')`?",
        options: ["False", "True", "None", "0"],
        correct_answer: ["False"],
      },
      {
        question: "What is the result of `bool('0')`?",
        options: ["True", "False", "None", "Error"],
        correct_answer: ["True"],
      },
      {
        question: "What will `print(2 ** 3)` output?",
        options: ["8", "6", "9", "5"],
        correct_answer: ["8"],
      },
      {
        question: "How to convert a string '123' to an integer?",
        options: ["int('123')", "str(123)", "toInt('123')", "parseInt('123')"],
        correct_answer: ["int('123')"],
      },
      {
        question: "What does `is` keyword check?",
        options: ["Identity", "Equality", "Type", "Value"],
        correct_answer: ["Identity"],
      },
    ],
  },
];
