export const Binary_numbers_divisible_by_3 = `
    // Input: a binary number n
// Ouput: accepts if n mod 3 == 0
// Example: accepts 110 (=6)
//
// Divisible by 3 Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
//
// ------- States -----------|
// q0 - mod3 == 0            |
// q1 - mod3 == 1            |
// q2 - mod3 == 2            |
// qaccept - accepting state |
//---------------------------|

name: Binary numbers divisible by 3
init: q0
accept: qAccept

q0,0
q0,0,>

q0,1
q1,1,>

q1,0
q2,0,>

q1,1
q0,1,>

q2,0
q1,0,>

q2,1
q2,1,>

q0,_
qAccept,_,-
`.trim();

export const Binary_palindrome = `
// Input: a binary number n
// Ouput: accepts if n is a palindrome
// Example: accepts 10101
//
// Palindrome Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com

name: Binary palindrome
init: q0
accept: qAccept

q0,0
qRight0,_,>

qRight0,0
qRight0,0,>

qRight0,1
qRight0,1,>

q0,1
qRight1,_,>

qRight1,0
qRight1,0,>

qRight1,1
qRight1,1,>

qRight0,_
qSearch0L,_,<

qSearch0L,0
q1,_,<

qRight1,_
qSearch1L,_,<

qSearch1L,1
q1,_,<

q1,0
qLeft0,_,<

qLeft0,0
qLeft0,0,<

qLeft0,1
qLeft0,1,<

q1,1
qLeft1,_,<

qLeft1,0
qLeft1,0,<

qLeft1,1
qLeft1,1,<

qLeft0,_
qSearch0R,_,>

qSearch0R,0
q0,_,>

qLeft1,_
qSearch1R,_,>

qSearch1R,1
q0,_,>

qSearch0R,1
qReject,1,-

qSearch1R,0
qReject,0,-

qSearch0L,1
qReject,1,-

qSearch1L,0
qReject,0,-

q0,_
qAccept,_,-

q1,_
qAccept,_,-

qSearch0L,_
qAccept,_,-

qSearch0R,_
qAccept,_,-

qSearch1L,_
qAccept,_,-

qSearch1R,_
qAccept,_,-
`.trim();

export const Decimal_to_binary = `
//////////////////////
// turing: dec to bin
//////////////////////

// Copyright (c) 2013 Max von Buelow
// Copyright (c) 2013 kd3x
// License: CC BY-NC-SA 3.0

// Simulator: turingmachinesimulator.com
// Initial state: qinit
// Accepting state: qfin

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Greetings to the course 'FGdI 1' 
// at the TU Darmstadt.
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

name: Decimal to binary
init: qinit
accept: qfin

qinit,0
qinit,0,>
 
qinit,1
qinit,1,>
 
qinit,2
qinit,2,>
 
qinit,3
qinit,3,>
 
qinit,4
qinit,4,>
 
qinit,5
qinit,5,>
 
qinit,6
qinit,6,>
 
qinit,7
qinit,7,>
 
qinit,8
qinit,8,>
 
qinit,9
qinit,9,>
 
qinit,_
halve,0,<
 
// Halve and go to addHalf to add the goBack
halve,0
halve,0,<
 
halve,1
addHalf,0,>
 
halve,2
halve,1,<
 
halve,3
addHalf,1,>
 
halve,4
halve,2,<
 
halve,5
addHalf,2,>
 
halve,6
halve,3,<
 
halve,7
addHalf,3,>
 
halve,8
halve,4,<
 
halve,9
addHalf,4,>
 
// Add 0.5 to the right
addHalf,0
jump,5,<
 
addHalf,1
jump,6,<
 
addHalf,2
jump,7,<
 
addHalf,3
jump,8,<
 
addHalf,4
jump,9,<
 
// Jump back
jump,0
halve,0,<
 
jump,1
halve,1,<
 
jump,2
halve,2,<
 
jump,3
halve,3,<
 
jump,4
halve,4,<
 
// If we halved successfully, we first remove the zero if there is one and then we go back
halve,_
removezero,_,>
 
removezero,0
removezero,_,>
 
removezero,1
goBack,1,>
 
removezero,2
goBack,2,>
 
removezero,3
goBack,3,>
 
removezero,4
goBack,4,>
 
removezero,5
goBack,5,>
 
removezero,6
goBack,6,>
 
removezero,7
goBack,7,>
 
removezero,8
goBack,8,>
 
removezero,9
goBack,9,>
 
// qfinished
removezero,_
qfin,_,>
 
// normal goBack
goBack,0
goBack,0,>
 
goBack,1
goBack,1,>
 
goBack,2
goBack,2,>
 
goBack,3
goBack,3,>
 
goBack,4
goBack,4,>
 
goBack,5
goBack,5,>
 
goBack,6
goBack,6,>
 
goBack,7
goBack,7,>
 
goBack,8
goBack,8,>
 
goBack,9
goBack,9,>
 
// rest
goBack,_
rest,_,<
 
rest,0
rest0,_,>
 
rest0,_
setrest0,_,>
 
rest,5
rest1,_,>
 
rest1,_
setrest1,_,>
 
setrest0,0
setrest0,0,>
 
setrest0,1
setrest0,1,>
 
setrest1,0
setrest1,0,>
 
setrest1,1
setrest1,1,>
 
setrest0,_
continue,0,<
 
setrest1,_
continue,1,<
 
// continue
continue,0
continue,0,<
 
continue,1
continue,1,<
 
continue,_
continue2,_,<
 
// delimiter
continue2,_
halve,0,<
`.trim();

export const Even_amount_of_zeros = `
// Input: a binary number n
// Ouput: accepts if n has
// an even amount of 0s
// Example: accepts 100100
//
// Even Amount of 0s Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
//
// --------- States -----------|
// q0  amount of 0s mod2 == 0  |
// q1  amount of 0s mod2 == 1  |
// qAccept - accepting state   |
//-----------------------------|

name: Even amount of zeros
init: q0
accept: qAccept

q0,0
q1,0,>

q1,0
q0,0,>

q0,1
q0,1,>

q1,1
q1,1,>

q0,_
qAccept,_,-
`.trim();

export const Duplicate_binary_string = `
//Author: Gabriel Alvarez
// Simulator: https://turingmachinesimulator.com
// Initial state: qinit
// Accepting state: qfin
// Whole alphabet: 0,1,o,i

// Comments: We duplicate the size of
// a binary string by concatenating
// the string to its mirror image.
// i/o will be used as "markers" for
// the squares with 1's and 0's
// (respectively).

name: Duplicate binary string
init: qinit
accept: qfin

qinit,0
qinit,0,>

qinit,1
qinit,1,>

qinit,o
qinit,0,>

qinit,i
qinit,1,>

qinit,_
copying_from_right_to_left,_,<

//We place a marker (o/i) over the
//first number found. We ignore the
//squares already marked
copying_from_right_to_left,0
copying_0_to_the_right,o,>

copying_from_right_to_left,1
copying_1_to_the_right,i,>

copying_from_right_to_left,o
copying_from_right_to_left,o,<

copying_from_right_to_left,i
copying_from_right_to_left,i,<

//If we find a blank square -->
//we copy our value (marked) and
//come back
copying_0_to_the_right,_
copying_from_right_to_left,o,<

copying_1_to_the_right,_
copying_from_right_to_left,i,<

//If we find a non-blank square -->
//we ignore it and keep moving right
copying_0_to_the_right,0
copying_0_to_the_right,0,>

copying_0_to_the_right,1
copying_0_to_the_right,1,>

copying_0_to_the_right,o
copying_0_to_the_right,o,>

copying_0_to_the_right,i
copying_0_to_the_right,i,>

copying_1_to_the_right,0
copying_1_to_the_right,0,>

copying_1_to_the_right,1
copying_1_to_the_right,1,>

copying_1_to_the_right,o
copying_1_to_the_right,o,>

copying_1_to_the_right,i
copying_1_to_the_right,i,>

//When we finished copying the whole
//string --> it's time to remove the
//markers
copying_from_right_to_left,_
removing_the_markers,_,>

removing_the_markers,o
removing_the_markers,0,>

removing_the_markers,i
removing_the_markers,1,>

removing_the_markers,0
removing_the_markers,0,<

removing_the_markers,1
removing_the_markers,1,<

removing_the_markers,_
qfin,_,>
`.trim();

export const Fast_binary_palindrome = `
// Input: a binary number n
// Ouput: accepts if n is a palindrome
// Example: accepts 10101
//
// Palindrome Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
//
// --------- States -----------|
// qCopy - copy to second tape |
// qReturn - return first tape |
// qTest - Test each character |
// qaccept - accepting state   |
//-----------------------------|

name: Fast binary palindrome
init: qCopy
accept: qAccept

qCopy,0,_
qCopy,0,0,>,>

qCopy,1,_
qCopy,1,1,>,>

qCopy,_,_
qReturn,_,_,-,<

qReturn,_,0
qReturn,_,0,-,<

qReturn,_,1
qReturn,_,1,-,<

qReturn,_,_
qTest,_,_,<,>

qTest,0,0
qTest,0,0,<,>

qTest,1,1
qTest,1,1,<,>

qTest,_,_
qAccept,_,_,-,-
`.trim();

export const Logarithm_of_length = `
// Input: binary number n
// Ouput: floor(log(|n|))
// |n| is the length of n
// Example: 1111 returns 10

// Logarithm of Length Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
// by Pedro Aste - ppaste@uc.cl

name: Logarithm of length
init: q0
accept: q7

q0,0,_
q0,_,1,>,-

q0,1,_
q0,_,1,>,-

q0,0,1
q1,_,0,-,<

q1,_,_
q2,_,1,-,>

q0,1,1
q1,_,0,-,<

q0,0,0
q0,_,1,>,-

q0,1,0
q0,_,1,>,-

q0,0,1
q1,_,0,-,<

q1,_,1
q1,_,0,-,<

q1,_,0
q2,_,1,-,<

q2,_,1
q2,_,1,-,>

q2,_,0
q2,_,0,-,>

q2,_,_
q0,_,_,>,<

q0,_,0
q3,_,0,-,-

q0,_,1
q3,_,1,-,-

q3,_,0
q3,0,_,<,<

q3,_,1
q3,1,_,<,<

q3,_,_
q4,_,_,>,-

q4,0,_
q4,_,0,>,-

q4,1,_
q4,_,0,>,-

q4,0,1
q5,_,0,>,<

q5,_,_
q6,_,1,-,>

q5,0,_
q6,0,1,-,>

q5,1,_
q6,1,1,-,>

q4,1,1
q5,_,0,>,<

q4,0,0
q4,_,1,>,-

q4,1,0
q4,_,1,>,-

q5,_,1
q5,_,0,-,<

q5,_,0
q6,_,1,-,<

q6,_,1
q6,_,1,-,>

q6,_,0
q6,_,0,-,>

q5,0,1
q5,0,0,-,<

q5,0,0
q6,0,1,-,<

q6,0,1
q6,0,1,-,>

q6,0,0
q6,0,0,-,>

q5,1,1
q5,1,0,-,<

q5,1,0
q6,1,1,-,<

q6,1,1
q6,1,1,-,>

q6,1,0
q6,1,0,-,>

q6,0,_
q4,0,_,-,<

q6,1,_
q4,1,_,-,<

q4,_,1
q7,_,1,-,-

q6,_,_
q7,_,_,-,<
`.trim();

export const Binary_addition = `
// Input: a#b (a and b are binary numbers)
// Ouput: a+b
// Example: 1011#10 outputs 1101
//
// Binary Addition Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
// By Jose Antonio Matte

name: Binary addition
init: q0
accept: q5

q0,0,_,_
q0,0,_,_,>,-,-

q0,1,_,_
q0,1,_,_,>,-,-

q0,#,_,_
q1,_,_,_,>,-,-

q1,0,_,_
q1,_,0,_,>,>,-

q1,1,_,_
q1,_,1,_,>,>,-

q1,_,_,_
q2,_,_,_,<,<,-

q2,_,0,_
q2,_,0,_,<,-,-

q2,_,1,_
q2,_,1,_,<,-,-

q2,1,0,_
q3,1,0,_,-,-,-

q2,1,1,_
q3,1,1,_,-,-,-

q2,0,1,_
q3,0,1,_,-,-,-

q2,0,0,_
q3,0,0,_,-,-,-

q3,1,0,_
q3,1,0,1,<,<,<

q3,0,1,_
q3,0,1,1,<,<,<

q3,0,0,_
q3,0,0,0,<,<,<

q3,1,1,_
q4,1,1,0,<,<,<

q3,_,_,_
q5,_,_,_,-,-,-

q3,1,_,_
q3,1,_,1,<,<,<

q3,0,_,_
q3,0,_,0,<,<,<

q3,_,1,_
q3,_,1,1,<,<,<

q3,_,0,_
q3,_,0,0,<,<,<

q4,0,0,_
q3,0,0,1,<,<,<

q4,0,1,_
q4,0,1,0,<,<,<

q4,1,0,_
q4,1,0,0,<,<,<

q4,1,1,_
q4,1,1,1,<,<,<

q4,_,0,_
q3,_,0,1,<,<,<

q4,_,1,_
q4,_,1,0,<,<,<

q4,1,_,_
q4,1,_,0,<,<,<

q4,0,_,_
q3,0,_,1,<,<,<

q4,_,_,_
q5,_,_,1,-,-,-
`.trim();

export const Binary_Multiplication = `
// Input: a#b (where a and b are binary numbers)
// Ouput: a*b
// Example: 101#10 outputs 1010
//
// Binary Multiplication Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
// by Pedro Aste - ppaste@uc.cl
// 
//
// ------- States -----------|
// q0 - qStart               |
// q1 - qInCopy              |
// q2 - qInCopyBack          |
// q3 - qAnalize             |
// q4 - qShift               |
// q5 - qSum                 |
// q6 - qErase               |
// q7 - qSumaBack            |
// q8 - qCarry               |
// q9 - qFinalCopy           |
// q10 - qFinal              |
//---------------------------\'

name: Binary Multiplication
init: q0
accept: q10

// Moves right until finds the "#".

q0,0,_,_
q0,0,_,_,>,-,-

q0,1,_,_
q0,1,_,_,>,-,-

// Reads "#", moves second number to second tape.

q0,#,_,_
q1,_,_,_,>,-,-

q1,0,_,_
q1,_,0,_,>,>,-

q1,1,_,_
q1,_,1,_,>,>,-

// Finishes the previous movement.

q1,_,_,_
q2,_,_,_,<,-,-

q2,_,_,_
q2,_,_,_,<,-,-

q2,0,_,_
q3,0,_,_,-,-,-

q2,1,_,_
q3,1,_,_,-,-,-

// Reads the first number from
// the last digit to the first,
// if the digit is a 0, does
// nothing, otherwise, sums the
// number on the second tape to
// the third, keeping the sum on
// the third tape. Then multiplies
// the number on the second tape by 2.

q3,0,_,_
q4,0,_,_,-,-,-

q3,1,_,_
q5,1,_,_,-,<,<

q3,_,_,_
q6,_,_,_,>,-,-

// Shift left, second tape.

q4,0,_,_
q3,0,0,_,<,>,-

q4,1,_,_
q3,1,0,_,<,>,-

// Sum

q5,1,0,0
q5,1,0,0,-,<,<

q5,1,0,1
q5,1,0,1,-,<,<

q5,1,1,0
q5,1,1,1,-,<,<

q5,1,1,1
q8,1,1,0,-,<,<

q5,1,0,_
q5,1,0,0,-,<,<

q5,1,1,_
q5,1,1,1,-,<,<

q5,1,_,0
q5,1,_,0,-,<,<

q5,1,_,1
q5,1,_,1,-,<,<

q5,1,_,_
q7,1,_,_,-,>,>

// Sum Carry.

q8,1,1,1
q8,1,1,1,-,<,<

q8,1,1,0
q8,1,1,0,-,<,<

q8,1,0,1
q8,1,0,0,-,<,<

q8,1,0,0
q5,1,0,1,-,<,<

q8,1,0,_
q5,1,0,1,-,<,<

q8,1,1,_
q8,1,1,0,-,<,<

q8,1,_,0
q5,1,_,1,-,<,<

q8,1,_,1
q8,1,_,0,-,<,<

q8,1,_,_
q5,1,_,1,-,<,<

// Head goes back to the end of the second and third tape.

q7,1,_,0
q7,1,_,0,-,>,>

q7,1,_,1
q7,1,_,1,-,>,>

q7,1,0,_
q7,1,0,_,-,>,>

q7,1,1,_
q7,1,1,_,-,>,>

q7,1,0,0
q7,1,0,0,-,>,>

q7,1,0,1
q7,1,0,1,-,>,>

q7,1,1,0
q7,1,1,0,-,>,>

q7,1,1,1
q7,1,1,1,-,>,>

q7,1,_,_
q4,1,_,_,-,-,-

// First tape deletion.

q6,0,_,_
q6,_,_,_,>,-,-

q6,1,_,_
q6,_,_,_,>,-,-

q6,_,_,_
q9,_,_,_,<,<,<

// Moves the output to the first tape.

q9,0,0,0
q9,0,_,_,<,<,<

q9,0,0,1
q9,1,_,_,<,<,<

q9,0,1,0
q9,0,_,_,<,<,<

q9,0,1,1
q9,1,_,_,<,<,<

q9,1,0,0
q9,0,_,_,<,<,<

q9,1,0,1
q9,1,_,_,<,<,<

q9,1,1,0
q9,0,_,_,<,<,<

q9,1,1,1
q9,1,_,_,<,<,<

q9,0,_,_
q9,_,_,_,<,-,-

q9,1,_,_
q9,_,_,_,<,-,-

q9,_,0,_
q9,_,_,_,-,<,-

q9,_,1,_
q9,_,_,_,-,<,-

q9,_,_,0
q9,0,_,_,<,-,<

q9,_,_,1
q9,1,_,_,<,-,<

q9,0,0,_
q9,_,_,_,<,<,-

q9,0,1,_
q9,_,_,_,<,<,-

q9,1,0,_
q9,_,_,_,<,<,-

q9,1,1,_
q9,_,_,_,<,<,-

q9,0,_,0
q9,0,_,_,<,<,<

q9,1,_,0
q9,0,_,_,<,<,<

q9,0,_,0
q9,0,_,_,<,<,<

q9,0,_,1
q9,1,_,_,<,<,<

q9,1,_,1
q9,1,_,_,<,<,<

q9,_,0,0
q9,0,_,_,<,<,<

q9,_,0,1
q9,1,_,_,<,<,<

q9,_,1,0
q9,0,_,_,<,<,<

q9,_,1,1
q9,1,_,_,<,<,<

q9,_,_,_
q10,_,_,_,-,-,-
`.trim();
