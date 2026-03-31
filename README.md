# @pipeworx/mcp-iplookup

MCP server for IP geolocation — look up location, ISP, and network info for any IP. Wraps [ip-api.com](http://ip-api.com/) (free, no auth for basic usage).

## Tools

| Tool | Description |
|------|-------------|
| `geolocate_ip` | Look up geolocation, ISP, and network info for a single IP address |
| `batch_geolocate` | Geolocate up to 100 IP addresses in a single request |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "iplookup": {
      "url": "https://gateway.pipeworx.io/iplookup/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use iplookup
```

## License

MIT
