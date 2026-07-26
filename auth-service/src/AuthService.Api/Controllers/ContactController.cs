using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ContactController(IEmailService emailService) : ControllerBase
{
    [HttpPost("send")]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<IActionResult> Send([FromBody] ContactEmailDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var name = request.Name?.Trim() ?? string.Empty;
        var email = request.Email?.Trim() ?? string.Empty;
        var message = request.Message?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
        {
            return BadRequest(new
            {
                success = false,
                message = "Completa nombre, correo y mensaje para enviar el formulario."
            });
        }

        if (!email.Contains('@') || !email.Contains('.'))
        {
            return BadRequest(new
            {
                success = false,
                message = "Ingresa un correo electrónico válido."
            });
        }

        await emailService.SendContactMessageAsync(name, email, message);

        return Ok(new
        {
            success = true,
            message = "Tu mensaje fue enviado correctamente."
        });
    }
}
