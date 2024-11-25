using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DevOps24 API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer prefix",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure database context
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information));

// Configure JWT Authentication
var jwtKeyBase64 = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKeyBase64))
{
    throw new Exception("JWT key is missing in configuration.");
}

byte[] jwtKeyBytes;

try
{
    jwtKeyBytes = Convert.FromBase64String(jwtKeyBase64);
    Console.WriteLine("JWT Secret decoded from Base64.");
}
catch (FormatException)
{
    Console.WriteLine("JWT Secret is not Base64-encoded. Using it as plain text.");
    jwtKeyBytes = Encoding.UTF8.GetBytes(jwtKeyBase64);
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://wkzkiurvoslbhpmxmpid.supabase.co/auth/v1";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "https://wkzkiurvoslbhpmxmpid.supabase.co",
            ValidAudience = "https://wkzkiurvoslbhpmxmpid.supabase.co",
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes)
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully.");
                return Task.CompletedTask;
            }
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policyBuilder =>
    {
        policyBuilder.WithOrigins("http://localhost:5173", "https://localhost:5173")
                     .AllowAnyHeader()
                     .AllowAnyMethod()
                     .AllowCredentials();
    });
});

// Add password hasher
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Add HttpClient for Supabase API
builder.Services.AddHttpClient("SupabaseClient", client =>
{
    var supabaseUrl = builder.Configuration["Supabase:Url"];
    var supabaseApiKey = builder.Configuration["Supabase:ApiKey"];

    if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseApiKey))
    {
        throw new Exception("Supabase configuration is missing in appsettings.json or environment variables.");
    }

    client.BaseAddress = new Uri(supabaseUrl);
    client.DefaultRequestHeaders.Add("apikey", supabaseApiKey);
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("An unexpected error occurred.");
    });
});

// Enable CORS
app.UseCors("AllowFrontend");

// Middleware pipeline
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
