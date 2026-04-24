from __future__ import annotations

import asyncio
from datetime import date, datetime, time
from typing import Any

import pymssql

from ...settings import MSSQLSettings
from .models import Product

SELECT_COLS = "p.Id, p.ProductTypeId, p.Name, p.ExternalKey, p.Gtin, p.Sku, p.CreatedOnUtc, p.Published as is_published"


def _iso(v: Any) -> str | None:
    if v is None:
        return None
    if isinstance(v, (datetime, date, time)):
        return v.isoformat()
    return str(v)


def _opt_str(v: Any) -> str | None:
    return str(v) if v is not None else None


def _to_bool(val: Any) -> bool:
    if val is None:
        return True
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return val != 0
    if isinstance(val, str):
        return val.strip().lower() in {"1", "true", "t", "yes", "y"}
    return bool(val)


def _row_to_product(row: tuple[Any, ...]) -> Product:
    pid, ptype, name, ext_key, gtin, sku, created_on, is_published = row

    return Product(
        id=int(pid),
        product_type_id=int(ptype) if ptype is not None else None,
        name=str(name) if name is not None else "",
        external_key=_opt_str(ext_key),
        gtin=_opt_str(gtin),
        sku=_opt_str(sku),
        created_on_utc=_iso(created_on),
        is_published=_to_bool(is_published),
    )


class MSSQLProductStore:
    """Read-only MSSQL-backed product store."""

    def __init__(self, settings: MSSQLSettings):
        if not settings.configured:
            raise RuntimeError("MSSQL not configured (set MSSQL_HOST/USER/DATABASE).")
        self._cfg = settings

    def _connect(self):
        cfg = self._cfg
        return pymssql.connect(
            server=cfg.host,
            port=str(cfg.port),
            user=cfg.user,
            password=cfg.password,
            database=cfg.database,
            timeout=cfg.timeout_seconds,
            login_timeout=cfg.timeout_seconds,
            autocommit=True,
        )

    def _list_sync(self, search: str | None, limit: int) -> list[Product]:
        limit = max(1, min(limit, self._cfg.row_limit))
        with self._connect() as conn, conn.cursor() as cur:
            if search:
                sql = (
                    f"SELECT TOP (%s) {SELECT_COLS} FROM dbo.Product p "
                    "WHERE p.Name LIKE %s OR p.Sku LIKE %s OR p.Gtin LIKE %s "
                    "ORDER BY p.CreatedOnUtc DESC"
                )
                like = f"%{search}%"
                cur.execute(sql, (limit, like, like, like))
            else:
                sql = (
                    f"SELECT TOP (%s) {SELECT_COLS} FROM dbo.Product p "
                    "ORDER BY p.CreatedOnUtc DESC"
                )
                cur.execute(sql, (limit,))
                resp = [_row_to_product(r) for r in cur.fetchall()]
            return resp

    def _get_sync(self, product_id: int) -> Product | None:
        with self._connect() as conn, conn.cursor() as cur:
            cur.execute(
                f"SELECT {SELECT_COLS} FROM dbo.Product p WHERE p.Id = %s",
                (product_id,),
            )
            row = cur.fetchone()
            response = _row_to_product(row) if row else None
            print(response)
            return response

    async def list(
        self, *, search: str | None = None, limit: int = 50
    ) -> list[Product]:
        return await asyncio.to_thread(self._list_sync, search, limit)

    async def get(self, product_id: int) -> Product | None:
        return await asyncio.to_thread(self._get_sync, product_id)
