import type { Example } from './types'

export const EXAMPLES: Example[] = [
  {
    name: 'Hello World',
    description: 'Basic output',
    code: `show "Hello, ZARA!"`,
  },
  {
    name: 'Variables',
    description: 'Set and display variables',
    code: `set x = 42
set name = "ZARA"
show x
show name`,
  },
  {
    name: 'Arithmetic',
    description: 'Math operations',
    code: `set a = 10
set b = 3
show a + b
show a - b
show a * b
show a / b`,
  },
  {
    name: 'Conditionals',
    description: 'when / otherwise',
    code: `set score = 85
when score >= 90
    show "Grade: A"
when score >= 80
    show "Grade: B"
when score >= 70
    show "Grade: C"
otherwise
    show "Grade: F"`,
  },
  {
    name: 'While Loop',
    description: 'Loop with condition',
    code: `set i = 1
loop while i <= 5
    show i
    set i = i + 1
show "Done!"`,
  },
  {
    name: 'Sum 1 to 10',
    description: 'Accumulate with loop',
    code: `set sum = 0
set i = 1
loop while i <= 10
    set sum = sum + i
    set i = i + 1
show sum`,
  },
  {
    name: 'String Concat',
    description: 'Joining strings',
    code: `set first = "Hello"
set second = "World"
show first + " " + second`,
  },
  {
    name: 'Comments',
    description: 'Code with comments',
    code: `# This is a comment
set x = -5
# Negate it
set y = -x
show y`,
  },
]
