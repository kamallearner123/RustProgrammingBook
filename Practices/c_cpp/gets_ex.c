#include <stdio.h>
#include <string.h>

void get_password()
{
    struct {
        char password[16];
        unsigned int guard;
    } data;

    data.guard = 0x12345678;

    printf("Before overflow:\n");
    printf("  password = %s\n", data.password);
    printf("  guard    = 0x%08X\n", data.guard);

    printf("\nEnter password: ");

    /*
     * Deliberately unsafe:
     * allows more than 16 bytes to be written.
     */
    scanf("%s", data.password);

    printf("\nAfter input:\n");
    printf("  password = %s\n", data.password);
    printf("  guard    = 0x%08X\n", data.guard);

    if (data.guard != 0x12345678)
        printf("\n*** BUFFER OVERFLOW: guard was corrupted! ***\n");
    else
        printf("\nGuard is unchanged.\n");
}

int main()
{
    get_password();
    return 0;
}
