using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DuodriverPrep.Backend.Api.Tests;

public class SmokeTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Health_Live_Returns_Ok()
    {
        var response = await _client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(json);

        Assert.Equal("ok", document.RootElement.GetProperty("status").GetString());
        Assert.Equal("live", document.RootElement.GetProperty("check").GetString());
    }

    [Fact]
    public async Task Health_Ready_Returns_Ok()
    {
        var response = await _client.GetAsync("/health/ready");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(json);

        Assert.Equal("ok", document.RootElement.GetProperty("status").GetString());
        Assert.Equal("ready", document.RootElement.GetProperty("check").GetString());
    }
}
