export const regex = {
    IPv4RegexWithParentheses : new RegExp("\\(.+\\)"),
    timeRegex : new RegExp("\\w+\\.\\w+ ms"),
    hopRegex : new RegExp("^[ |\\d]\\d"),
    IPv4Regex : new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"),
}
