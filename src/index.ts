interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * IP Lookup MCP — ip-api.com (free, no auth for basic usage)
 *
 * Tools:
 * - geolocate_ip: get geolocation, ISP, and timezone info for a single IP address
 * - batch_geolocate: geolocate up to 100 IP addresses in a single request
 */


const BASE_URL = 'http://ip-api.com';
const FIELDS = 'status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as';

const tools: McpToolExport['tools'] = [
  {
    name: 'geolocate_ip',
    description:
      'Look up the geolocation, ISP, and network information for a single IP address (IPv4 or IPv6). Returns country, region, city, coordinates, timezone, ISP, and AS number.',
    inputSchema: {
      type: 'object',
      properties: {
        ip: {
          type: 'string',
          description: 'IPv4 or IPv6 address to look up (e.g., "8.8.8.8", "2001:4860:4860::8888")',
        },
      },
      required: ['ip'],
    },
  },
  {
    name: 'batch_geolocate',
    description:
      'Look up geolocation for multiple IP addresses in a single request. Accepts up to 100 IPs. Returns an array of results in the same order as the input.',
    inputSchema: {
      type: 'object',
      properties: {
        ips: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of IPv4 or IPv6 addresses to look up (maximum 100)',
        },
      },
      required: ['ips'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'geolocate_ip':
      return geolocateIp(args.ip as string);
    case 'batch_geolocate':
      return batchGeolocate(args.ips as string[]);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

interface IpApiResponse {
  status: string;
  message?: string;
  country?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  query?: string;
}

function formatResult(data: IpApiResponse) {
  if (data.status === 'fail') {
    throw new Error(`IP lookup failed: ${data.message ?? 'unknown error'}`);
  }
  return {
    ip: data.query ?? null,
    country: data.country ?? null,
    country_code: data.countryCode ?? null,
    region: data.regionName ?? null,
    city: data.city ?? null,
    postal_code: data.zip ?? null,
    latitude: data.lat ?? null,
    longitude: data.lon ?? null,
    timezone: data.timezone ?? null,
    isp: data.isp ?? null,
    organization: data.org ?? null,
    as_number: data.as ?? null,
  };
}

async function geolocateIp(ip: string) {
  const res = await fetch(`${BASE_URL}/json/${encodeURIComponent(ip)}?fields=${FIELDS}`);
  if (!res.ok) throw new Error(`ip-api.com error: ${res.status}`);

  const data = (await res.json()) as IpApiResponse;
  return formatResult(data);
}

async function batchGeolocate(ips: string[]) {
  if (!Array.isArray(ips) || ips.length === 0) {
    throw new Error('ips must be a non-empty array of IP addresses');
  }
  if (ips.length > 100) {
    throw new Error('Maximum 100 IPs per batch request');
  }

  const body = ips.map((ip) => ({ query: ip, fields: FIELDS }));

  const res = await fetch(`${BASE_URL}/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ip-api.com batch error: ${res.status}`);

  const data = (await res.json()) as IpApiResponse[];

  return {
    count: data.length,
    results: data.map((entry) => {
      if (entry.status === 'fail') {
        return { ip: entry.query ?? null, error: entry.message ?? 'lookup failed' };
      }
      return formatResult(entry);
    }),
  };
}

export default { tools, callTool } satisfies McpToolExport;
