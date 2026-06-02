export function handleCommand(line) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
        return "ERROR empty command";
    }

    const [command, ...parts] = trimmed.split(" ");
    const argument = parts.join(" ");

    switch (command.toUpperCase()) {
        case "ECHO":
            return argument;

        case "UPPER":
            return argument.toUpperCase();

        case "LOWER":
            return argument.toLowerCase();

        case "REVERSE":
            // Splits the argument string into characters, reverses them, and joins them back
            return argument.split("").reverse().join("");

        case "TIME":
            // Returns the current server time in ISO format
            return new Date().toISOString();

        case "QUIT":
            return "Goodbye.";

        default:
            return `ERROR unknown command: ${command}`;
    }
}

export function shouldCloseConnection(line) {
    return line.trim().toUpperCase() === "QUIT";
}