#include<stdio.h>
#include<stdlib.h>
void log_input(char *user_input) {
    printf("userinput = %d\n", *(int *)user_input);
}

int main() {
	char ptr[] = {'a'};
	log_input(ptr);
}
