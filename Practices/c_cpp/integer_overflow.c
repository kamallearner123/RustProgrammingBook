#include <stdio.h>
void transfer_funds(unsigned int amount) {
    unsigned int balance = 100;
    if (balance - amount >= 0) { // Check if we have enough
        balance -= amount;
        printf("Transfer successful!\n");
    }
    printf("balance = %u\n", balance);
}


int main() {
	transfer_funds(1000);
}
