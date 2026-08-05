using System.Security.Claims;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private const string SubClaim = "sub";
    private const string NameIdentifierClaim = ClaimTypes.NameIdentifier;

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<object>> GetProfile()
    {
        var userId = GetUserIdFromClaims();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await authService.GetUserByIdAsync(userId);
        if (user is null)
            return NotFound();

        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    [HttpPost("profile/by-id")]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<ActionResult<object>> GetProfileById([FromBody] GetProfileByIdDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            return BadRequest(new
            {
                success = false,
                message = "El userId es requerido"
            });
        }

        var user = await authService.GetUserByIdAsync(request.UserId);
        if (user is null)
        {
            return NotFound(new
            {
                success = false,
                message = "Usuario no encontrado"
            });
        }

        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    [HttpPost("register")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.RegisterAsync(registerDto);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.LoginAsync(loginDto);
        if (result.Success)
        {
            var accessOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = result.ExpiresAt
            };

            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            };

            Response.Cookies.Append("access_token", result.Token, accessOptions);
            if (!string.IsNullOrEmpty(result.RefreshToken))
                Response.Cookies.Append("refresh_token", result.RefreshToken, refreshOptions);

            // Do not return raw tokens in the JSON body
            var responseBody = new AuthResponseDto
            {
                Success = result.Success,
                Message = result.Message,
                Token = result.Token,
                RefreshToken = result.RefreshToken,
                UserDetails = result.UserDetails,
                ExpiresAt = result.ExpiresAt
            };

            return Ok(responseBody);
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized(new { success = false, message = "Refresh token missing" });

        var result = await authService.RefreshTokenAsync(refreshToken);

        if (result.Success)
        {
            var accessOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = result.ExpiresAt
            };

            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            };

            Response.Cookies.Append("access_token", result.Token, accessOptions);
            if (!string.IsNullOrEmpty(result.RefreshToken))
                Response.Cookies.Append("refresh_token", result.RefreshToken, refreshOptions);

            var responseBody = new AuthResponseDto
            {
                Success = result.Success,
                Message = result.Message,
                Token = string.Empty,
                RefreshToken = string.Empty,
                UserDetails = result.UserDetails,
                ExpiresAt = result.ExpiresAt
            };
            return Ok(responseBody);
        }

        return Unauthorized(new { success = false, message = "Unable to refresh token" });
    }

    [HttpPost("logout")]
    public async Task<ActionResult<object>> Logout()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await authService.RevokeRefreshTokenAsync(refreshToken);
        }

        // Remove cookies
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");

        return Ok(new { success = true, message = "Logged out" });
    }

    [HttpPost("validate-token")]
    [Authorize]
    public ActionResult<object> ValidateToken()
    {
        var userId = GetUserIdFromClaims();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        return Ok(new
        {
            success = true,
            userId,
            role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? string.Empty
        });
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.VerifyEmailAsync(verifyEmailDto);
        return Ok(result);
    }

    [HttpPost("resend-verification")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.ResendVerificationEmailAsync(resendDto);

        if (!result.Success)
        {
            if (result.Message.Contains("no encontrado", StringComparison.OrdinalIgnoreCase))
                return NotFound(result);

            if (result.Message.Contains("ya ha sido verificado", StringComparison.OrdinalIgnoreCase) ||
                result.Message.Contains("ya verificado", StringComparison.OrdinalIgnoreCase))
                return BadRequest(result);

            return StatusCode(StatusCodes.Status503ServiceUnavailable, result);
        }

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.ForgotPasswordAsync(forgotPasswordDto);

        if (!result.Success)
            return StatusCode(StatusCodes.Status503ServiceUnavailable, result);

        return Ok(result);
    }

    [HttpPost("reset-password")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await authService.ResetPasswordAsync(resetPasswordDto);
        return Ok(result);
    }

    private string? GetUserIdFromClaims()
    {
        return User.Claims
            .FirstOrDefault(c =>
                c.Type == SubClaim ||
                c.Type == NameIdentifierClaim)?.Value;
    }
}
