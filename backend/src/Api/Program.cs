var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Ok(new { service = "DuodriverPrep Backend" }));
app.MapGet("/health/live", () => Results.Ok(new { status = "ok", check = "live" }));
app.MapGet("/health/ready", () => Results.Ok(new { status = "ok", check = "ready" }));

app.Run();

public partial class Program;
