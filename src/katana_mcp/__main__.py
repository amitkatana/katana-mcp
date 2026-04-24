from __future__ import annotations

import argparse
import logging
from pathlib import Path

from .app import build_mcp
from .settings import MSSQLSettings, Settings


def main() -> None:
    env = Settings.from_env()
    parser = argparse.ArgumentParser(
        description="Todo MCP server (FastMCP, streamable HTTP)"
    )
    parser.add_argument("--host", default=env.host)
    parser.add_argument("--port", type=int, default=env.port)
    parser.add_argument("--log-level", default=env.log_level)
    parser.add_argument(
        "--allow-host", action="append", default=list(env.allowed_hosts)
    )
    parser.add_argument(
        "--allow-origin", action="append", default=list(env.allowed_origins)
    )
    parser.add_argument(
        "--dev",
        action="store_true",
        default=env.dev_mode,
        help="Disable DNS-rebinding protection (use with MCP Inspector / local testing only).",
    )

    parser.add_argument("--mssql-host", default=env.mssql.host)
    parser.add_argument("--mssql-port", type=int, default=env.mssql.port)
    parser.add_argument("--mssql-user", default=env.mssql.user)
    parser.add_argument("--mssql-password", default=env.mssql.password)
    parser.add_argument("--mssql-database", default=env.mssql.database)
    parser.add_argument(
        "--mssql-row-limit",
        type=int,
        default=env.mssql.row_limit,
        help="Cap rows returned per query (default 500)",
    )
    parser.add_argument(
        "--mssql-timeout",
        type=int,
        default=env.mssql.timeout_seconds,
        help="Connection / query timeout in seconds (default 30)",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level.upper(),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    settings = Settings(
        host=args.host,
        port=args.port,
        allowed_hosts=args.allow_host,
        allowed_origins=args.allow_origin,
        dev_mode=args.dev,
        log_level=args.log_level,
        mssql=MSSQLSettings(
            host=args.mssql_host,
            port=args.mssql_port,
            user=args.mssql_user,
            password=args.mssql_password,
            database=args.mssql_database,
            row_limit=args.mssql_row_limit,
            timeout_seconds=args.mssql_timeout,
        ),
    )
    mcp = build_mcp(settings)
    mcp.run(transport="streamable-http")


if __name__ == "__main__":
    main()
