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

        // TODO: implement UPPER
        // Example:UPPER tugce -> TUGCE
        case "UPPER":
            return argument.toUpperCase();

        // TODO: implement LOWER
        // Example:LOWER TUGCE -> tugce
        case "LOWER":
            return argument.toLowerCase();

        // TODO: implement REVERSE
        // Example:REVERSE TUGCE -> ECGUT
        case "REVERSE":
            // Splits the argument string into characters, reverses them, and joins them back
            return argument.split("").reverse().join("");
            
        // TODO: implement TIME
        // Example:TIME -> current server time
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