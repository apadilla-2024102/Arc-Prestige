namespace AuthService.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailVerificationAsync(string email, string username, string token);
    Task SendPasswordResetAsync(string email, string username, string token);
    Task SendWelcomeEmailAsync(string email, string username);
    Task SendContactMessageAsync(string fromName, string fromEmail, string message, string? toEmail = null);
}
