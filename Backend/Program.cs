using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on all IP addresses and the specific port
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5000); // Listen on port 5000 for HTTP
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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
builder.Services.AddDbContextFactory<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging()
           .EnableDetailedErrors());

// Add DbContextFactory for background services
builder.Services.AddDbContextFactory<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// JWT Configuration
var jwtKeyBase64 = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKeyBase64))
{
    throw new Exception("JWT key is missing in configuration. Ensure 'Jwt:Key' is set in appsettings.json or environment variables.");
}

byte[] jwtKeyBytes;
try
{
    // Attempt Base64 decode
    jwtKeyBytes = Convert.FromBase64String(jwtKeyBase64);
    Console.WriteLine("JWT Secret decoded from Base64.");
}
catch (FormatException)
{
    // If decoding fails, use plain text
    Console.WriteLine("JWT Secret is not Base64-encoded. Using it as plain text.");
    jwtKeyBytes = Encoding.UTF8.GetBytes(jwtKeyBase64);
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configure CORS to allow requests from the public domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://51.120.6.249", "https://51.120.6.249") // Allow requests from the VM's public domain
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

app.UseHttpsRedirection(); // HTTPS redirection will depend on SSL/TLS setup on your VM

// Enable CORS
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
