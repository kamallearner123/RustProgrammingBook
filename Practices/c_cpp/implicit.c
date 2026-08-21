#include <stdio.h>

int main() {
// C suffers from dangerous implicit type conversions (Integer Underflow)
unsigned int max_buffer = 100;
int user_input = -1;

// BUG: -1 is implicitly cast to an unsigned int (4294967295)
// This check evaluates to TRUE!
if (user_input > max_buffer) {
    printf("Access Denied");
}
}
