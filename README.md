# mcp-iplookup

IP Lookup MCP — ip-api.com (free, no auth for basic usage)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `geolocate_ip` | Look up an IP address to find its location and network details. Returns country, region, city, coordinates, timezone, ISP, and AS number. Use when you need to identify where a user or server is located. |
| `batch_geolocate` | Look up locations for up to 100 IP addresses at once. Returns geolocation and ISP data in the same order as input. Use for analyzing multiple IPs efficiently. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "iplookup": {
      "url": "https://gateway.pipeworx.io/iplookup/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Iplookup data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
