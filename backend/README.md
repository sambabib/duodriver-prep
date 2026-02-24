# Duodriver Backend Skeleton

This folder contains the initial .NET backend scaffold:

- `src/Api` - ASP.NET Core API host
- `src/Application` - application layer
- `src/Domain` - domain layer
- `src/Infrastructure` - infrastructure layer
- `tests/Api.Tests` - initial test project

## Note

The current environment does not have the .NET SDK installed (`dotnet` command not found), so solution generation and build verification were not run here.

Once .NET 8 SDK is installed locally, create a solution file and verify:

```bash
cd backend
dotnet new sln -n DuodriverPrep.Backend
dotnet sln add src/Api/Api.csproj src/Application/Application.csproj src/Domain/Domain.csproj src/Infrastructure/Infrastructure.csproj tests/Api.Tests/Api.Tests.csproj
dotnet build
dotnet test
```
