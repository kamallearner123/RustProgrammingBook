#include <stdio.h>
char *gets(char *);

void get_password() {
    char password[16];
    printf("Enter password: ");
    gets(password);
    printf("Passwword = %s\n", password);
}

int main() {
	get_password();
}
