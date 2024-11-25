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
byte[] jwtKeyBytes;
try
{
    // Attempt to decode the Base64 secret
    jwtKeyBytes = Convert.FromBase64String(jwtKeyBase64);
    Console.WriteLine("JWT Secret decoded from Base64.");
}
catch (FormatException)
{
    // Fallback if the secret is not Base64-encoded
    Console.WriteLine("JWT Secret is not Base64-encoded. Using it as plain text.");
    jwtKeyBytes = Encoding.UTF8.GetBytes(jwtKeyBase64);
}


// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Matches the `iss` claim in the token
            ValidateAudience = false, // Optional: Set to `true` if you want to validate `aud`
            ClockSkew = TimeSpan.Zero // Reduces the default 5-minute clock skew
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
