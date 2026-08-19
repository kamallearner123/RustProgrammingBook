import os

def remove_terminal_windows(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            new_lines = []
            in_terminal = False
            div_depth = 0
            count_removed = 0
            
            for line in lines:
                if not in_terminal:
                    if '<div class="terminal-window">' in line:
                        in_terminal = True
                        div_depth = 1
                        # If there are other divs on this same line, this simple script might fail, 
                        # but in our files it's typically on its own line.
                        # Let's count any other divs on this line
                        div_depth += line.count('<div') - 1
                        div_depth -= line.count('</div')
                        if div_depth == 0:
                            in_terminal = False
                        count_removed += 1
                    else:
                        new_lines.append(line)
                else:
                    div_depth += line.count('<div')
                    div_depth -= line.count('</div')
                    if div_depth <= 0:
                        in_terminal = False
            
            if count_removed > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f"Removed {count_removed} terminal windows from {filename}")

if __name__ == '__main__':
    remove_terminal_windows('.')
