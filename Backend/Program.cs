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
builder.Services.AddHostedService<AuctionManagementService>();


// Configure Swagger with JWT authentication
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
                },
                Scheme = "Bearer",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new string[] {}
        }
    });
});

// Configure database context
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information));

var jwtKeyBase64 = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKeyBase64))
{
    throw new Exception("JWT key is missing in configuration. Ensure 'Jwt:Key' is set in appsettings.json or environment variables.");
}

byte[] jwtKeyBytes;
try
{
    // Forsøg at dekode Base64
    jwtKeyBytes = Convert.FromBase64String(jwtKeyBase64);
    Console.WriteLine("JWT Secret decoded from Base64.");
}
catch (FormatException)
{
    // Hvis dekodning fejler, brug den som almindelig tekst
    Console.WriteLine("JWT Secret is not Base64-encoded. Using it as plain text.");
    jwtKeyBytes = Encoding.UTF8.GetBytes(jwtKeyBase64);
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes), // Bruger korrekt nøgle
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Skal matche `iss` claim i token
            ValidateAudience = false, // Ændr til `true`, hvis `aud` skal verificeres
            ClockSkew = TimeSpan.Zero // Undgå tidsforskelle
        };
    });


// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
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

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("An unexpected error occurred.");
    });
});

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
