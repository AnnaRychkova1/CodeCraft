import type { InitialTask } from "@/types/tasksTypes";
export const initialTasks: InitialTask[] = [
  {
    title: "Advanced Java Concepts Quiz",
    description:
      "Test your understanding of advanced Java topics, including memory, concurrency, and the JVM.",
    level: "advanced",
    language: "java",
    type: "theory",
    theory_question: [
      {
        question:
          "What is the default size of the Java thread stack (in most JVMs)?",
        options: ["512 KB", "1 MB", "2 MB", "It depends on the platform"],
        correct_answer: ["It depends on the platform"],
      },
      {
        question: "Which keyword prevents a method from being overridden?",
        options: ["final", "static", "private", "abstract"],
        correct_answer: ["final", "private"],
      },
      {
        question: "What does the `volatile` keyword guarantee?",
        options: [
          "Atomicity of operations",
          "Visibility of changes across threads",
          "Thread safety",
          "Immutability",
        ],
        correct_answer: ["Visibility of changes across threads"],
      },
      {
        question:
          "What is the result of using `==` to compare two different Integer objects with the same value between -128 and 127?",
        options: ["true", "false", "It depends on JVM", "Compile error"],
        correct_answer: ["true"],
      },
      {
        question:
          "Which of the following are features of the Java Memory Model?",
        options: [
          "Defines interaction between threads and memory",
          "Ensures sequential consistency",
          "Specifies instruction reordering rules",
          "Specifies heap size",
        ],
        correct_answer: [
          "Defines interaction between threads and memory",
          "Specifies instruction reordering rules",
        ],
      },
      {
        question: "Which of these classes are immutable in Java?",
        options: ["String", "StringBuilder", "Integer", "LocalDate"],
        correct_answer: ["String", "Integer", "LocalDate"],
      },
      {
        question:
          "What will happen if you call `wait()` outside a synchronized block?",
        options: [
          "Throws IllegalMonitorStateException",
          "Waits forever",
          "Nothing",
          "Compile-time error",
        ],
        correct_answer: ["Throws IllegalMonitorStateException"],
      },
      {
        question: "Which collection classes are thread-safe by default?",
        options: [
          "Vector",
          "HashMap",
          "ConcurrentHashMap",
          "CopyOnWriteArrayList",
        ],
        correct_answer: ["Vector", "ConcurrentHashMap", "CopyOnWriteArrayList"],
      },
      {
        question: "Which of the following can cause memory leaks in Java?",
        options: [
          "Unclosed streams",
          "Static references",
          "Listeners not removed",
          "Using try-with-resources",
        ],
        correct_answer: [
          "Unclosed streams",
          "Static references",
          "Listeners not removed",
        ],
      },
      {
        question: "What is true about the `transient` keyword in Java?",
        options: [
          "It marks a field to be excluded from serialization",
          "It prevents a field from being accessed from other packages",
          "It is used to indicate temporary variables",
          "It affects garbage collection",
        ],
        correct_answer: ["It marks a field to be excluded from serialization"],
      },
      {
        question:
          "Which of the following are valid functional interfaces in Java?",
        options: ["Runnable", "Callable", "Comparator", "List"],
        correct_answer: ["Runnable", "Callable", "Comparator"],
      },
      {
        question:
          "Which class loader loads classes from the Java standard library?",
        options: [
          "Bootstrap ClassLoader",
          "System ClassLoader",
          "Extension ClassLoader",
          "App ClassLoader",
        ],
        correct_answer: ["Bootstrap ClassLoader"],
      },
      {
        question: "How can you create a deadlock in Java?",
        options: [
          "By acquiring multiple locks in inconsistent order",
          "By using too many threads",
          "By blocking on a shared resource indefinitely",
          "By using `volatile`",
        ],
        correct_answer: [
          "By acquiring multiple locks in inconsistent order",
          "By blocking on a shared resource indefinitely",
        ],
      },
      {
        question:
          "What is the primary difference between `wait()` and `sleep()`?",
        options: [
          "`wait()` releases the monitor, `sleep()` does not",
          "`sleep()` requires synchronization, `wait()` does not",
          "Both are identical",
          "`sleep()` is used for I/O",
        ],
        correct_answer: ["`wait()` releases the monitor, `sleep()` does not"],
      },
      {
        question: "What is the advantage of `Optional` in Java 8+?",
        options: [
          "Avoids null pointer exceptions",
          "Improves performance",
          "Enables functional programming",
          "Replaces primitive types",
        ],
        correct_answer: [
          "Avoids null pointer exceptions",
          "Enables functional programming",
        ],
      },
      {
        question: "Which of these streams are lazy in Java?",
        options: [
          "Streams from `java.util.stream`",
          "I/O streams",
          "Collectors",
          "BufferedWriter",
        ],
        correct_answer: ["Streams from `java.util.stream`"],
      },
      {
        question:
          "What is a potential problem of using `HashMap` in multithreaded code without synchronization?",
        options: [
          "Race conditions",
          "Deadlocks",
          "Infinite loops",
          "Lost updates",
        ],
        correct_answer: ["Race conditions", "Infinite loops", "Lost updates"],
      },
      {
        question: "How can you make a Java class immutable?",
        options: [
          "Make the class final",
          "Make fields final and private",
          "Do not provide setters",
          "Clone all mutable fields in constructors and getters",
        ],
        correct_answer: [
          "Make the class final",
          "Make fields final and private",
          "Do not provide setters",
          "Clone all mutable fields in constructors and getters",
        ],
      },
      {
        question:
          "What is the difference between `StringBuilder` and `StringBuffer`?",
        options: [
          "`StringBuilder` is thread-safe",
          "`StringBuffer` is thread-safe",
          "Both are immutable",
          "Both support method chaining",
        ],
        correct_answer: [
          "`StringBuffer` is thread-safe",
          "Both support method chaining",
        ],
      },
      {
        question: "What is the purpose of the `java.lang.ref` package?",
        options: [
          "To provide different levels of references",
          "To force garbage collection",
          "To avoid memory leaks",
          "To manage object finalization",
        ],
        correct_answer: ["To provide different levels of references"],
      },
      {
        question: "What does `CompletableFuture` enable in Java?",
        options: [
          "Asynchronous programming",
          "Reactive streams",
          "Non-blocking I/O",
          "ForkJoin parallelism",
        ],
        correct_answer: ["Asynchronous programming", "ForkJoin parallelism"],
      },
      {
        question: "Which are valid ways to implement a singleton in Java?",
        options: [
          "Using an enum",
          "Using a static field and synchronized block",
          "Using `private static final` instance",
          "Using multiple constructors",
        ],
        correct_answer: [
          "Using an enum",
          "Using a static field and synchronized block",
          "Using `private static final` instance",
        ],
      },
      {
        question: "What JVM component is responsible for JIT compilation?",
        options: [
          "HotSpot",
          "Garbage Collector",
          "Interpreter",
          "Class Loader",
        ],
        correct_answer: ["HotSpot"],
      },
      {
        question:
          "Which of the following are thread-safe ways to increment a counter?",
        options: [
          "Using `AtomicInteger`",
          "Using `synchronized` block",
          "Using `int++` in multiple threads",
          "Using `ReentrantLock`",
        ],
        correct_answer: [
          "Using `AtomicInteger`",
          "Using `synchronized` block",
          "Using `ReentrantLock`",
        ],
      },
      {
        question: "Which of these features are part of Java 17 LTS?",
        options: [
          "Sealed classes",
          "Pattern matching for instanceof",
          "ZGC as stable",
          "Project Loom",
        ],
        correct_answer: [
          "Sealed classes",
          "Pattern matching for instanceof",
          "ZGC as stable",
        ],
      },
    ],
  },
  {
    title: "Advanced JavaScript Concepts Quiz",
    description:
      "Challenge your knowledge of advanced JavaScript topics including closures, event loop, memory management, and ES6+ features.",
    level: "advanced",
    language: "javascript",
    type: "theory",
    theory_question: [
      {
        question: "What are characteristics of JavaScript closures?",
        options: [
          "They can access variables from outer functions",
          "They create private variables",
          "They increase memory usage indefinitely",
          "They are functions returned by other functions",
        ],
        correct_answer: [
          "They can access variables from outer functions",
          "They create private variables",
          "They are functions returned by other functions",
        ],
      },
      {
        question:
          "Which of the following statements about the JavaScript event loop are true?",
        options: [
          "It manages the execution of synchronous and asynchronous code",
          "It uses a call stack and a task queue",
          "It blocks the UI thread during async operations",
          "It processes microtasks before macrotasks",
        ],
        correct_answer: [
          "It manages the execution of synchronous and asynchronous code",
          "It uses a call stack and a task queue",
          "It processes microtasks before macrotasks",
        ],
      },
      {
        question:
          "What will the following code output?\n\n```js\nconsole.log(typeof NaN);\n```",
        options: ["'number'", "'NaN'", "'undefined'", "'object'"],
        correct_answer: ["'number'"],
      },
      {
        question:
          "Which of these methods can be used to create shallow copies of objects?",
        options: [
          "Object.assign()",
          "Spread operator (...)",
          "JSON.parse(JSON.stringify())",
          "Array.slice()",
        ],
        correct_answer: ["Object.assign()", "Spread operator (...)"],
      },
      {
        question:
          "What is the output of the following snippet?\n\n```js\nconsole.log(0.1 + 0.2 === 0.3);\n```",
        options: ["true", "false", "TypeError", "undefined"],
        correct_answer: ["false"],
      },
      {
        question:
          "Which of the following are valid ways to create a new Promise?",
        options: [
          "new Promise((resolve, reject) => {})",
          "Promise.resolve(value)",
          "Promise.reject(error)",
          "Async function",
        ],
        correct_answer: [
          "new Promise((resolve, reject) => {})",
          "Promise.resolve(value)",
          "Promise.reject(error)",
          "Async function",
        ],
      },
      {
        question:
          "Which of the following is true about JavaScript's `this` keyword?",
        options: [
          "In arrow functions, `this` is lexically bound",
          "`this` always refers to the global object",
          "In event handlers, `this` refers to the event target",
          "`this` can be changed using `call` and `apply`",
        ],
        correct_answer: [
          "In arrow functions, `this` is lexically bound",
          "In event handlers, `this` refers to the event target",
          "`this` can be changed using `call` and `apply`",
        ],
      },
      {
        question:
          "What are the primary differences between `var`, `let`, and `const`?",
        options: [
          "`var` is function scoped, `let` and `const` are block scoped",
          "`const` variables cannot be reassigned",
          "`var` declarations are hoisted",
          "`let` variables are immutable",
        ],
        correct_answer: [
          "`var` is function scoped, `let` and `const` are block scoped",
          "`const` variables cannot be reassigned",
          "`var` declarations are hoisted",
        ],
      },
      {
        question:
          "What will the following code output?\n\n```js\nconsole.log(typeof null);\n```",
        options: ["'null'", "'object'", "'undefined'", "'boolean'"],
        correct_answer: ["'object'"],
      },
      {
        question:
          "Which of the following methods are array iteration methods that do not mutate the original array?",
        options: ["map()", "filter()", "forEach()", "splice()"],
        correct_answer: ["map()", "filter()", "forEach()"],
      },
      {
        question:
          "Which ES6 feature allows destructuring arrays or objects into variables?",
        options: [
          "Spread syntax",
          "Destructuring assignment",
          "Template literals",
          "Rest parameters",
        ],
        correct_answer: ["Destructuring assignment"],
      },
      {
        question:
          "Which of the following are true about generators in JavaScript?",
        options: [
          "They use `function*` syntax",
          "They can pause and resume execution",
          "They return Promises",
          "They implement the iterator protocol",
        ],
        correct_answer: [
          "They use `function*` syntax",
          "They can pause and resume execution",
          "They implement the iterator protocol",
        ],
      },
      {
        question: "How can you prevent an object from being modified?",
        options: [
          "Object.freeze()",
          "Object.seal()",
          "Using `const` to declare the object",
          "Using Proxy",
        ],
        correct_answer: ["Object.freeze()", "Object.seal()"],
      },
      {
        question: "What is a memory leak in JavaScript?",
        options: [
          "When memory is not freed even if no references exist",
          "When too many objects are created",
          "When variables are redeclared",
          "When event listeners are not properly removed",
        ],
        correct_answer: [
          "When memory is not freed even if no references exist",
          "When event listeners are not properly removed",
        ],
      },
      {
        question:
          "Which of these are valid ways to handle asynchronous code in JavaScript?",
        options: ["Callbacks", "Promises", "Async/Await", "Generators"],
        correct_answer: ["Callbacks", "Promises", "Async/Await", "Generators"],
      },
      {
        question:
          "Which of the following operators are used for comparison without type coercion?",
        options: ["==", "===", "!=", "!=="],
        correct_answer: ["===", "!=="],
      },
      {
        question: "What does the 'use strict' directive do in JavaScript?",
        options: [
          "Enables strict mode",
          "Prevents accidental globals",
          "Disables some silent errors",
          "Allows usage of future reserved keywords",
        ],
        correct_answer: [
          "Enables strict mode",
          "Prevents accidental globals",
          "Disables some silent errors",
        ],
      },
      {
        question: "What are WeakMap and WeakSet used for?",
        options: [
          "Storing objects without preventing garbage collection",
          "Keeping strong references to keys",
          "Implementing private data in classes",
          "Storing primitive data types",
        ],
        correct_answer: [
          "Storing objects without preventing garbage collection",
          "Implementing private data in classes",
        ],
      },
      {
        question:
          "Which methods are used to convert JavaScript values to JSON and parse JSON back?",
        options: ["JSON.stringify()", "JSON.parse()", "toJSON()", "eval()"],
        correct_answer: ["JSON.stringify()", "JSON.parse()"],
      },
      {
        question: "Which of the following are true about JavaScript modules?",
        options: [
          "They are imported using `import` statements",
          "They support default and named exports",
          "They execute in the global scope",
          "They help with code encapsulation",
        ],
        correct_answer: [
          "They are imported using `import` statements",
          "They support default and named exports",
          "They help with code encapsulation",
        ],
      },
      {
        question:
          "What is true about the 'this' value inside an arrow function?",
        options: [
          "It is lexically scoped",
          "It is dynamically scoped",
          "It refers to the global object in strict mode",
          "It cannot be changed with call/apply/bind",
        ],
        correct_answer: [
          "It is lexically scoped",
          "It cannot be changed with call/apply/bind",
        ],
      },
      {
        question: "What is the purpose of the JavaScript Proxy object?",
        options: [
          "To intercept and customize operations on objects",
          "To create immutable objects",
          "To create private variables",
          "To implement inheritance",
        ],
        correct_answer: ["To intercept and customize operations on objects"],
      },
      {
        question: "Which of the following is true about event delegation?",
        options: [
          "It allows handling events on parent elements",
          "It improves performance by reducing event listeners",
          "It only works with bubbling events",
          "It prevents default browser behavior",
        ],
        correct_answer: [
          "It allows handling events on parent elements",
          "It improves performance by reducing event listeners",
          "It only works with bubbling events",
        ],
      },
      {
        question:
          "Which of these are valid ways to create objects in JavaScript?",
        options: [
          "Using object literals",
          "Using constructor functions",
          "Using `Object.create()`",
          "Using classes",
        ],
        correct_answer: [
          "Using object literals",
          "Using constructor functions",
          "Using `Object.create()`",
          "Using classes",
        ],
      },
    ],
  },
  {
    title: "Advanced Python Concepts Quiz",
    description:
      "Deep dive into Python internals, behavior, and advanced syntax.",
    level: "advanced",
    language: "python",
    type: "theory",
    theory_question: [
      {
        question: "What is the result of `[] is not []`?",
        options: ["True", "False", "None", "Raises Error"],
        correct_answer: ["True"],
      },
      {
        question:
          "Which of these statements about Python’s GIL (Global Interpreter Lock) is correct?",
        options: [
          "It allows true parallel execution of threads.",
          "It only affects multiprocessing, not threading.",
          "It ensures that only one thread executes Python bytecode at a time.",
          "It is used only in Python 2.",
        ],
        correct_answer: [
          "It ensures that only one thread executes Python bytecode at a time.",
        ],
      },
      {
        question: "What does the `@staticmethod` decorator do?",
        options: [
          "Defines a method that belongs to the class and not instances",
          "Creates a private method",
          "Passes the class as the first argument",
          "Creates a method with access to the instance",
        ],
        correct_answer: [
          "Defines a method that belongs to the class and not instances",
        ],
      },
      {
        question: "Which of these creates a generator?",
        options: [
          "Using `yield` in a function",
          "Using a list comprehension",
          "Using `[]` brackets",
          "Using `return`",
        ],
        correct_answer: ["Using `yield` in a function"],
      },
      {
        question: "What is the purpose of `__slots__` in a Python class?",
        options: [
          "It restricts the creation of new instance attributes",
          "It makes the class abstract",
          "It allows dynamic typing",
          "It disables inheritance",
        ],
        correct_answer: [
          "It restricts the creation of new instance attributes",
        ],
      },
      {
        question: "Which of the following expressions will raise an exception?",
        options: [
          "`{1, 2}[1]`",
          "`{1, 2}.pop()`",
          "`{1, 2}.remove(1)`",
          "`{1, 2}[0]`",
        ],
        correct_answer: ["`{1, 2}[0]`"],
      },
      {
        question: "What is the result of: `bool([False])`?",
        options: ["True", "False", "None", "Raises Error"],
        correct_answer: ["True"],
      },
      {
        question:
          "What is the output of `list(map(lambda x: x * 2, [1, 2, 3]))`?",
        options: ["[2, 4, 6]", "[1, 2, 3]", "[1, 4, 9]", "[2, 3, 4]"],
        correct_answer: ["[2, 4, 6]"],
      },
      {
        question: "What is monkey patching in Python?",
        options: [
          "Modifying class or module at runtime",
          "Removing functions from a class",
          "Replacing a variable with another type",
          "Changing syntax tree",
        ],
        correct_answer: ["Modifying class or module at runtime"],
      },
      {
        question: "Which method is called when an object is created?",
        options: ["__init__", "__new__", "__call__", "__create__"],
        correct_answer: ["__new__"],
      },
      {
        question: "What does `*args` allow in function definitions?",
        options: [
          "Accept any number of positional arguments",
          "Accept only string arguments",
          "Accept key-value arguments",
          "Access private members",
        ],
        correct_answer: ["Accept any number of positional arguments"],
      },
      {
        question:
          "Which of these tools is used for concurrency (not parallelism) in Python?",
        options: ["threading", "multiprocessing", "asyncio", "subprocess"],
        correct_answer: ["asyncio"],
      },
      {
        question:
          "Which of the following is true about `isinstance([], object)`?",
        options: ["True", "False", "Raises TypeError", "Depends on version"],
        correct_answer: ["True"],
      },
      {
        question: "What is the result of `set('abc') == {'a', 'b', 'c'}`?",
        options: ["True", "False", "Raises Error", "None"],
        correct_answer: ["True"],
      },
      {
        question: "Which of these will NOT be garbage collected?",
        options: [
          "Circular references without __del__",
          "Global variables",
          "Locally created and dereferenced objects",
          "Unreachable lists",
        ],
        correct_answer: ["Global variables"],
      },
      {
        question:
          "What is the primary benefit of `dataclasses` introduced in Python 3.7?",
        options: [
          "They reduce boilerplate for class definitions",
          "They improve runtime performance",
          "They are immutable by default",
          "They compile to C code",
        ],
        correct_answer: ["They reduce boilerplate for class definitions"],
      },
      {
        question: "Which comparison is True: `float('NaN') == float('NaN')`?",
        options: ["True", "False", "None", "Raises Error"],
        correct_answer: ["False"],
      },
      {
        question: "Which of these types are hashable?",
        options: ["frozenset", "tuple", "list", "dict"],
        correct_answer: ["frozenset", "tuple"],
      },
      {
        question: "What does `locals()` return?",
        options: [
          "A dictionary of local symbol table",
          "A list of variable names",
          "Global context",
          "None",
        ],
        correct_answer: ["A dictionary of local symbol table"],
      },
      {
        question: "Which of the following creates a shallow copy?",
        options: [
          "copy.copy()",
          "copy.deepcopy()",
          "obj.clone()",
          "obj.copy(deep=True)",
        ],
        correct_answer: ["copy.copy()"],
      },
      {
        question: "What is a metaclass in Python?",
        options: [
          "A class of a class",
          "A factory function",
          "An abstract base",
          "A decorator",
        ],
        correct_answer: ["A class of a class"],
      },
      {
        question: "How can you detect if a variable is a coroutine?",
        options: [
          "Use `inspect.iscoroutine()`",
          "Check `type()`",
          "Compare with async type",
          "Run `eval()`",
        ],
        correct_answer: ["Use `inspect.iscoroutine()`"],
      },
      {
        question: "What is the `nonlocal` keyword used for?",
        options: [
          "Modify variables in the enclosing function scope",
          "Create global variables",
          "Create non-Python variables",
          "Create immutable variables",
        ],
        correct_answer: ["Modify variables in the enclosing function scope"],
      },
      {
        question: "What does the walrus operator `:=` do?",
        options: [
          "Assigns value to a variable as part of an expression",
          "Defines a lambda",
          "Used in async functions",
          "Used in decorators",
        ],
        correct_answer: [
          "Assigns value to a variable as part of an expression",
        ],
      },
      {
        question:
          "What happens if you subclass an immutable type and override `__setattr__`?",
        options: [
          "Still can't set attributes",
          "Allows mutation",
          "Raises Error",
          "Breaks class",
        ],
        correct_answer: ["Still can't set attributes"],
      },
    ],
  },
];
