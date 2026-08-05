namespace AuthService.Application.DTOs;

public class AuthResponseDto
{
    public bool Success { get; init; } = true;
    public string Message { get; init; } = string.Empty;
    public string Token { get; init; } = string.Empty;
    // Raw refresh token is returned only to the controller so it can be set
    // as an HttpOnly cookie. The controller will not include it in the
    // response body sent to the client.
    public string RefreshToken { get; init; } = string.Empty;
    public UserDetailsDto UserDetails { get; init; } = new();

    public DateTime ExpiresAt { get; init; }
}