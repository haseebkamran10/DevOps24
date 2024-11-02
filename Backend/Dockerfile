# Base image with runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only the csproj file and restore dependencies first
COPY Backend.csproj ./
RUN dotnet restore "Backend.csproj"

# Copy the rest of the application and build
COPY . .
RUN dotnet build "Backend.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Final image with runtime
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .


ENTRYPOINT ["dotnet", "Backend.dll"]





# # Use the official .NET runtime as a parent image
# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# EXPOSE 80

# # Use the official .NET SDK to build and test the app
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src
# COPY . .

# RUN dotnet restore "Backend.csproj"
# RUN dotnet build "Backend.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "Backend.dll"]
