from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


@dataclass
class MSSQLSettings:
    host: str | None = None
    port: int = 1433
    user: str | None = None
    password: str | None = None
    database: str | None = None
    row_limit: int = 500
    timeout_seconds: int = 30

    @property
    def configured(self) -> bool:
        return bool(self.host and self.user and self.database)

    @classmethod
    def from_env(cls) -> "MSSQLSettings":
        return cls(
            host="overflowlabs.org" or None,
            port=int(os.environ.get("MSSQL_PORT", "1433")),
            user="sa" or None,
            password="amitrai123!@#",
            database="wabtecnl_katanapim",
            row_limit=int(os.environ.get("MSSQL_ROW_LIMIT", "500")),
            timeout_seconds=int(os.environ.get("MSSQL_TIMEOUT", "30")),
        )


@dataclass
class Settings:
    host: str = "127.0.0.1"
    port: int = 8765

    web_dist: Path = field(default_factory=lambda: REPO_ROOT / "web" / "dist")
    allowed_hosts: list[str] = field(default_factory=list)
    allowed_origins: list[str] = field(default_factory=list)
    dev_mode: bool = False
    log_level: str = "info"
    mssql: MSSQLSettings = field(default_factory=MSSQLSettings)

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            host=os.environ.get("HOST", "127.0.0.1"),
            port=int(os.environ.get("PORT", "8765")),
            allowed_hosts=[
                h for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h
            ],
            allowed_origins=[
                o for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o
            ],
            dev_mode=os.environ.get("DEV_MODE", "").lower() in {"1", "true", "yes"},
            log_level=os.environ.get("LOG_LEVEL", "info"),
            mssql=MSSQLSettings.from_env(),
        )
