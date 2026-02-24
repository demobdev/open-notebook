from typing import Any, Dict, List, Optional

from loguru import logger
from surreal_commands import get_command_status, submit_command

from open_notebook.database.repository import repo_query


class CommandService:
    """Generic service layer for command operations"""

    @staticmethod
    async def submit_command_job(
        module_name: str,  # Actually app_name for surreal-commands
        command_name: str,
        command_args: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Submit a generic command job for background processing"""
        try:
            # Ensure command modules are imported before submitting
            # This is needed because submit_command validates against local registry
            try:
                import commands.podcast_commands  # noqa: F401
            except ImportError as import_err:
                logger.error(f"Failed to import command modules: {import_err}")
                raise ValueError("Command modules not available")

            # surreal-commands expects: submit_command(app_name, command_name, args)
            cmd_id = submit_command(
                module_name,  # This is actually the app name (e.g., "open_notebook")
                command_name,  # Command name (e.g., "process_text")
                command_args,  # Input data
            )
            # Convert RecordID to string if needed
            if not cmd_id:
                raise ValueError("Failed to get cmd_id from submit_command")
            cmd_id_str = str(cmd_id)
            logger.info(
                f"Submitted command job: {cmd_id_str} for {module_name}.{command_name}"
            )
            return cmd_id_str

        except Exception as e:
            logger.error(f"Failed to submit command job: {e}")
            raise

    @staticmethod
    async def get_command_status(job_id: str) -> Dict[str, Any]:
        """Get status of any command job"""
        try:
            status = await get_command_status(job_id)
            return {
                "job_id": job_id,
                "status": status.status if status else "unknown",
                "result": status.result if status else None,
                "error_message": getattr(status, "error_message", None)
                if status
                else None,
                "created": str(status.created)
                if status and hasattr(status, "created") and status.created
                else None,
                "updated": str(status.updated)
                if status and hasattr(status, "updated") and status.updated
                else None,
                "progress": getattr(status, "progress", None) if status else None,
            }
        except Exception as e:
            logger.error(f"Failed to get command status: {e}")
            raise

    @staticmethod
    async def list_command_jobs(
        module_filter: Optional[str] = None,
        command_filter: Optional[str] = None,
        status_filter: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """List command jobs from surreal-commands command table"""
        try:
            conditions: List[str] = []
            params: Dict[str, Any] = {"limit": limit}
            if module_filter:
                conditions.append("app = $module_filter")
                params["module_filter"] = module_filter
            if command_filter:
                conditions.append("name = $command_filter")
                params["command_filter"] = command_filter
            if status_filter:
                conditions.append("status = $status_filter")
                params["status_filter"] = status_filter
            where = f" WHERE {' AND '.join(conditions)}" if conditions else ""
            query = f"SELECT * FROM command{where} ORDER BY created DESC LIMIT $limit"
            rows = await repo_query(query, params)
            # SurrealDB query may return list of result sets; flatten if needed
            if rows and isinstance(rows[0], list):
                rows = rows[0]
            jobs: List[Dict[str, Any]] = []
            for row in rows:
                jobs.append({
                    "job_id": str(row.get("id", "")),
                    "app": row.get("app"),
                    "name": row.get("name"),
                    "status": row.get("status", "unknown"),
                    "error_message": row.get("error_message"),
                    "created": str(row["created"]) if row.get("created") else None,
                    "updated": str(row["updated"]) if row.get("updated") else None,
                    "args_preview": _args_preview(row.get("args")),
                })
            return jobs
        except Exception as e:
            logger.warning(f"Failed to list command jobs: {e}")
            return []

    @staticmethod
    async def cancel_command_job(job_id: str) -> bool:
        """Cancel a running command job"""
        try:
            logger.info(f"Attempting to cancel job: {job_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to cancel command job: {e}")
            raise


def _args_preview(args: Optional[Dict[str, Any]], max_len: int = 80) -> Optional[str]:
    """Build a short preview of command args for display"""
    if not args:
        return None
    parts: List[str] = []
    for k, v in list(args.items())[:3]:
        s = str(v) if v is not None else ""
        if len(s) > 30:
            s = s[:27] + "..."
        parts.append(f"{k}={s}")
    preview = ", ".join(parts)
    return preview[:max_len] + "..." if len(preview) > max_len else preview
